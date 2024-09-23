import { NextResponse } from 'next/server';
import validator from 'validator';
import { cookies } from 'next/headers';
import { jwtValid, jwtDecode } from '@/lib/func';
import { getUser } from '@/lib/UserFunction';
import pool from '@/lib/db';
import { verifyPassword } from '@/lib/func';

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        return 'Invalid email address';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password || validator.isEmpty(password)) {
        return 'Invalid password';
    }
    return null;
};

const validateName = (name) => {
    if (!name || validator.isEmpty(name)) {
        return 'username is required';
    }
    return null;
};

const validateGender = (gender) => {
    const validGenders = ['M', 'F', 'DLL', "Male", "Female", "Lainnya", "Other"];
    if (!gender || !validGenders.includes(gender)) {
        return 'Invalid gender';
    }
    return null;
};

const validateOptionalDate = (date) => {
    if (date && !validator.isDate(date)) {
        return 'Invalid birthday date';
    }
    return null;
};

const validateOptionalField = (field, fieldName) => {
    if (field && validator.isEmpty(field)) {
        return `Invalid ${fieldName}`;
    }
    return null;
};

const buildUpdateQuery = (data, id) => {
    const { name, gender, birthday, city, address, phone, email } = data;
    const updates: string[] = [];
    
    if (name && name?.length > 0) updates.push(`username = '${name}'`);
    if (gender && gender?.length > 0) updates.push(`gender = '${gender == "M" ? "M" : gender == "F" ? "F" : gender == "Male" ? "M" : gender == "Female" ? "F" : "DLL"}'`);
    if (birthday && birthday?.length > 1) updates.push(`birthday = '${birthday}'`);
    if (city && city?.length > 1) updates.push(`city = '${city}'`);
    if (address && address?.length > 1) updates.push(`address = '${address}'`);
    if (phone && phone?.length > 1) updates.push(`phone = '${phone}'`);
    if (email && email?.length > 1) updates.push(`email = '${email}'`);

    if (updates.length === 0) {
        return null;
    }

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = '${id}'`;
    return query;
};

export async function POST(request: Request) {
    const { username, gender, birthday, city, address, phone, email, password } = await request.json();
    console.log(username, gender, birthday, city, address, phone, email, password)
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    let id: any = false;
    if (!isAuth) return new Response('{ status: 401, message: `unauthorized` }', { status: 200, headers: { 'content-type': "application/json" } });
    try{
        id = jwtDecode(token);
    }catch(e){
        console.log(e)
    }
    const validators = [
        validateEmail(email),
        validatePassword(password),
        validateName(username),
        validateGender(gender),
        validateOptionalDate(birthday),
        validateOptionalField(city, 'city'),
        validateOptionalField(address, 'address'),
        validateOptionalField(phone, 'phone number'),
    ];
    const errors = validators.filter(error => error);
    if (errors.length > 0) {
        return new Response(errors.join(', '), { status: 400 });
    }
    var query = `SELECT * FROM users WHERE id = '${id.id}'`;
    const results = await pool.query(query)
    if(!results.rows || results.rows.length < 1){
        return new Response('Akun tidak ditemukan', { status: 404 });
    }
    var passwordVerify = await verifyPassword(password, results.rows[0].password)    
    const user = results.rows[0];
    if(!passwordVerify) return new Response('Password salah', { status: 403 });    
    const queryy = buildUpdateQuery({ username, gender, birthday, city, address, phone, email }, id.id);
    if (!queryy) {
        return new Response('No fields to update', { status: 400 });
    }

    try {
        console.log(queryy)
        const resultsd = await pool.query(queryy);
        return new Response(`{ "status": 200, "message": "Profile updated successfully" }`, { status: 200, headers: { 'content-type': "application/json" } });;
    } catch (error) {
        console.log(error)
        return new Response('Error updating profile', { status: 500 });
    }
}