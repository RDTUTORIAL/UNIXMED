import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers"
import fs from "fs"
var blacklist_path = "./data/blacklist.json"

export async function GET(request: Request, response: Response) {    
  const token:any = cookies().get("accessToken") || "";
  try {
    let blacklist = JSON.parse(fs.readFileSync(blacklist_path, "utf-8"))
    var index = blacklist.findIndex(x => x.token == token.value)
    if(index != -1) return new Response('{ "message": "unauthorized" }', { status: 401 })
    jwt.verify(token.value, process.env.JWT_SECRET as string);
    return new Response('{ "valid": true }', { status: 200 });   
  } catch (error) {
    return new Response('{ "valid": false }', { status: 401 });   
  }
}
