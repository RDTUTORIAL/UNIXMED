import validator from 'validator';
import pool from '@/lib/db'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import fs from "fs"
var blacklist_path = "./data/blacklist.json"

export async function GET(request: Request, response: Response) {
    let blacklist = JSON.parse(fs.readFileSync(blacklist_path, "utf-8"))
    const token: any = cookies().get("accessToken") || "";
    try {
        await jwt.verify(token?.value, process.env.JWT_SECRET as string);
        var index = blacklist.findIndex(x => x.token == token.value)
        if (index != -1) return new Response('{ "message": "unauthorizedd" }', { status: 401 })
        blacklist.push({ token: token.value, expired: (Date.now() + (1000 * 60 * 60 * 24)) })
        fs.writeFileSync(blacklist_path, JSON.stringify(blacklist, null, 2))
        return new Response('{ "message": "ok" }', { status: 200, headers: { 'content-type': 'application/json', 'Set-Cookie': `accessToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=5` } });
    } catch (error) {
        console.log(error)
        return redirect("/");
    }
}