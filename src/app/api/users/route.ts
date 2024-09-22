import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtValid, jwtDecode } from '@/lib/func';
import { getUser } from '@/lib/UserFunction';
import moment from 'moment';

export async function GET(request: Request) {
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    let user: any = {}
    try {
        if (isAuth) {
            var id: any = jwtDecode(token);
            if (!id && id == false) return new Response('{ status: 401, message: `unauthorized` }', { status: 200, headers: { 'content-type': "application/json" } });
            user = await getUser(id?.id.toString())
        }
    } catch (e) {
        console.log(e)
    }
    return new Response(`{ 
    "status": 200, 
    "message": "success", 
    "data": { 
        "nama": "${user.name}",
        "email": "${user.email}",
        "phone_number": "${user.phone ? user.phone : ""}",
        "date_birthday": "${user.birthday ? moment(user.birthday).format("YYYY-MM-DD") : ""}",
        "gender": "${user.gender == "M" ? "Male" : user.gender == "F" ? "Female" : "Other"}",
        "address": "${user.address ? user.address : ""}",
        "city": "${user.city ? user.city : ""}"
    } 
}`, { status: 200, headers: { 'content-type': "application/json" } });;
}
