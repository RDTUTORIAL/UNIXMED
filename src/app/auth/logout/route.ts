import validator from 'validator';
import pool from '@/lib/db'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

export async function GET(request: Request, response: Response) {
    const cookieStore = cookies()
    const token: any = cookies().get("accessToken") || "";
    try {
        await jwt.verify(token?.value, process.env.JWT_SECRET as string);
        var result = await pool.query(`SELECT * FROM blacklist WHERE token = '${token.value}'`)
        if (result.rowCount === 0) {
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + 7);
            await pool.query(`INSERT INTO blacklist(token, expired) VALUES($1, $2)`, [token.value, futureDate]);
        }
        cookieStore.set({
            name: 'accessToken',  
            value: '',          
            expires: new Date(0),  
            path: '/',             
            httpOnly: true,        
            secure: true,       
            sameSite: 'strict',  
          });
        
        return redirect('/');
    } catch (error) {
        console.log(error)
        return redirect("/");
    }
}