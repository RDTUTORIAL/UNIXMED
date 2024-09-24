import validator from 'validator';
import pool from '@/lib/db'
import { verifyPassword } from '@/lib/func'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { jwtDecode, jwtValid } from '@/lib/func';

export async function POST(request: Request, response: Response) {
    const {
        medicationId,
        quantity,
        deliveryMethod,
        paymentMethod,
        email,
        total 
    } = await request.json();
    var token = cookies().get("accessToken")?.value || "";
    var isAuth = jwtValid(token);
    let id: any = false;
    if (!isAuth) return new Response('{ status: 401, message: `unauthorized` }', { status: 401, headers: { 'content-type': "application/json" } });
    try{
        id = jwtDecode(token);
    }catch(e){
        console.log(e);
        return new Response('{ status: 401, message: `unauthorized` }', { status: 401, headers: { 'content-type': "application/json" } });
    };
    var query = `INSERT INTO orders `
    return new Response('{ "message": "ok" }', { status: 200, headers: { 'content-type': 'application/json' } });
}