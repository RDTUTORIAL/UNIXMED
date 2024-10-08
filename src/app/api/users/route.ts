import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtValid, jwtDecode } from '@/lib/func';
import { getUser } from '@/lib/DBFunction';
import moment from 'moment';

export async function GET(request: Request) {
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    let user: any = {}
    try {
        if (isAuth) {
            var id: any = jwtDecode(token);
            if (!id && id == false) return new Response('{ status: 401, message: `unauthorized` }', { status: 401, headers: { 'content-type': "application/json" } });
            user = await getUser(id?.id.toString())
        }
    } catch (e) {
        console.log(e)
    }
    return new Response(`{ 
    "status": 200, 
    "message": "success", 
    "data": { 
        "username": "${user.username}",
        "email": "${user.email}",
        "phone_number": "${user.phone ? user.phone : ""}",
        "date_birthday": "${user.birthday ? moment(user.birthday).format("YYYY-MM-DD") : ""}",
        "gender": "${user.gender == "M" ? "Male" : user.gender == "F" ? "Female" : "Other"}",
        "address": "${user.address ? user.address : ""}",
        "city": "${user.city ? user.city : ""}",
        "pic": "${user.pic ? user.pic : "/image/Myu.webp"}"
    } 
}`, { status: 200, headers: { 'content-type': "application/json" } });;
}
