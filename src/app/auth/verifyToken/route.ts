import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers"
import fs from "fs"
import pool from '@/lib/db';

export async function GET(request: Request, response: Response) {    
  const token:any = cookies().get("accessToken") || "";
  try {
    var result = await pool.query(`SELECT * FROM blacklist WHERE token = '${token.value}'`)
    if (result?.rowCount || 0 > 0) return new Response('{ "valid": false }', { status: 401 }); 
    jwt.verify(token.value, process.env.JWT_SECRET as string);
    return new Response('{ "valid": true }', { status: 200 });   
  } catch (error) {
    return new Response('{ "valid": false }', { status: 401 });   
  }
}
