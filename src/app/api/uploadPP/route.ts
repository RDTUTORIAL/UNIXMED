// src/app/api/upload/route.js

import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import sanitizeFilename from 'sanitize-filename';
import { cookies } from 'next/headers';
import { jwtValid, jwtDecode } from '@/lib/func';
import pool from '@/lib/db';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request) {
    const data = await request.formData();
    const file = data.get('file');
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    let id: any = false;
    if (!isAuth) return new Response('{ status: 401, message: `unauthorized` }', { status: 200, headers: { 'content-type': "application/json" } });
    try {
        id = jwtDecode(token);
    } catch (e) {
        console.log(e)
    }
    if (!file) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: 'File size exceeds 5MB' }, { status: 400 });
    }

    const fileType = mime.lookup(file.name);
    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
        return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }
    var query = `SELECT * FROM users WHERE id = '${id.id}'`;
    const results = await pool.query(query)
    if(!results.rows || results.rows.length < 1){
        return NextResponse.json({ message: 'Account not found' }, { status: 400 });
    }
    const sanitizedFileName = sanitizeFilename(file.name).replace(/\s+/, "-");

    const extension = path.extname(sanitizedFileName) || mime.extension(fileType);
    const finalFileName = `${path.basename(sanitizedFileName, extension)}${Date.now()}${extension}`;

    const filePath = 'public/uploads/'+finalFileName;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        await fs.writeFile(filePath, buffer);
        await pool.query(`UPDATE users SET pic = $1 WHERE id = $2`, [`/api/uploads/${finalFileName}`, id.id])
        return NextResponse.json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}
