import { NextResponse } from 'next/server';
import validator from 'validator';
import pool from '@/lib/db'
import mysql, { RowDataPacket, QueryResult, FieldPacket } from 'mysql2';
import { hashPassword, verifyPassword } from '@/lib/func'
import { User } from '@/lib/interface';
import { v4 as uuidv4 } from 'uuid';

const validateName = (name: string) => {
    if (!name) return 'Name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    if (/[^a-zA-Z\s]/.test(name)) return 'Name must contain only letters and spaces';
    return null;
};

const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email format is invalid';
    if (/\s/.test(email)) return 'Email cannot contain spaces';
    return null;
};

const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
};

export async function POST(request: Request, response: Response) {
    const { name, email, password } = await request.json();    
    const errors: Record<string, string> = {};
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    if (Object.keys(errors).length > 0) {
        return new Response(`${errors}`, { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (!validator.isEmail(email)) {
        return new Response('Invalid email address', { status: 400 });
    }
    if (!password || validator.isEmpty(password)) {
        return new Response('Invalid password', { status: 400 });
    }
    const results = await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
    if (!results.rows || results.rows.length > 0) {
        return new Response('email already used', { status: 409 });
    }
    var id = uuidv4();
    var passwordHash = await hashPassword(password)
    try {
        const query = "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, 'patient') RETURNING *";
        const values = [id, name, email, passwordHash];
        const res = await pool.query(query, values);
        return new Response('{ "status": 200, message: "successfully registered account." }', { status: 200, headers: { 'content-type': 'application/json' } });
    } catch (error) {
        console.log(error)
        return new Response('{ "status": 500, message: "an error occurred in the system." }', { status: 500, headers: { 'content-type': 'application/json' } });
    }
}