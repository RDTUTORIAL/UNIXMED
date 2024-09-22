import validator from 'validator';
import pool from '@/lib/db'
import { verifyPassword } from '@/lib/func'
import jwt from 'jsonwebtoken';

export async function POST(request: Request, response: Response) {        
    const { email, password } = await request.json();
    if (!validator.isEmail(email)) {
        return new Response('Invalid email address', { status: 400 });
    }
    if (!password || validator.isEmpty(password)) {
        return new Response('Invalid password', { status: 400 });
    }
    var query = `SELECT * FROM users WHERE email = '${email}'`;
    const results = await pool.query(query)
    if(!results.rows || results.rows.length < 1){
        return new Response('Akun tidak ditemukan', { status: 404 });
    }
    var passwordVerify = await verifyPassword(password, results.rows[0].password)    
    const user = results.rows[0];
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    if(!passwordVerify) return new Response('Password salah', { status: 403 });    
    return new Response('{ "message": "ok" }', { status: 200, headers: { 'content-type': 'application/json', 'Set-Cookie': `accessToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`} });   
}