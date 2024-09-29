import validator from 'validator';
import pool from '@/lib/db'
import { verifyPassword } from '@/lib/func'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { jwtDecode, jwtValid } from '@/lib/func';
import { getObat, getUser } from '@/lib/DBFunction';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request, response: Response) {
    const {
        medicationId,
        quantity,
        deliveryMethod,
        paymentMethod,
        email
    } = await request.json();
    if (!medicationId || validator.isEmpty(medicationId) || !validator.isInt(medicationId.toString())) {
        return new Response(JSON.stringify({ status: 400, message: 'invalid medicationId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!quantity || validator.isEmpty(quantity) || !validator.isInt(quantity.toString())) {
        return new Response(JSON.stringify({ status: 400, message: 'invalid quantity' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!deliveryMethod || validator.isEmpty(deliveryMethod)) {
        return new Response(JSON.stringify({ status: 400, message: 'invalid deliveryMethod' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (deliveryMethod?.toLowerCase() !== "jnt" && deliveryMethod?.toLowerCase() !== "jne") {
        return new Response(JSON.stringify({ status: 400, message: 'deliveryMethod only JNT & JNE' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!paymentMethod || validator.isEmpty(paymentMethod)) {
        return new Response(JSON.stringify({ status: 400, message: 'invalid paymentMethod' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (paymentMethod?.toLowerCase() !== "dana" && paymentMethod?.toLowerCase() !== "shopee_pay") {
        return new Response(JSON.stringify({ status: 400, message: 'paymentMethod only Dana & ShopeePay' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!validator.isEmail(email)) {
        return new Response(JSON.stringify({ status: 400, message: 'invalid email' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    var token = cookies().get("accessToken")?.value || "";
    var isAuth = jwtValid(token);
    let id: any = false;
    if (!isAuth) return new Response(JSON.stringify({ status: 401, message: `unauthorized` }), { status: 401, headers: { 'content-type': "application/json" } });
    try {
        id = jwtDecode(token);
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ status: 401, message: `unauthorized` }), { status: 401, headers: { 'content-type': "application/json" } });
    };
    var deliveryPrice = 0;
    var user = await getUser(id?.id.toString())
    var obat = await getObat(medicationId)
    if (!user || user == false) new Response(JSON.stringify({ status: 401, message: `unauthorized` }), { status: 401, headers: { 'content-type': "application/json" } });
    if (!obat || obat == false) new Response(JSON.stringify({ status: 404, message: `No drugs were found.` }), { status: 404, headers: { 'content-type': "application/json" } });
    if (!user.address || user.address == null || user.address?.length < 1) return new Response(JSON.stringify({ status: 400, message: `Please fill in the address data on your profile first` }), { status: 400, headers: { 'content-type': "application/json" } });
    var orders_id = uuidv4();
    var results;
    var value;
    var query = `INSERT INTO orders (id, user_id, medication_id, banyak_pembelian, total_price, delivery_address, jenis_pengiriman, email, metode_pembayaran, sub_total, diskon) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
    var query_diskon = `SELECT m.name AS nama_obat, m.harga AS harga_awal, d.persentase_diskon, (m.harga - (m.harga * d.persentase_diskon / 100)) AS harga_setelah_diskon, (m.harga * d.persentase_diskon / 100) AS diskon FROM medications m LEFT JOIN diskon d ON m.id = d.medication_id WHERE m.id = ${medicationId} AND d.tanggal_mulai <= CURRENT_DATE AND d.tanggal_berakhir >= CURRENT_DATE;`
    try {
        results = await pool.query(query_diskon);
    } catch (e) {
        results = null;
    }
    if (!results || results == null || results.rows.length < 1 || results.rowCount == 0 || !results.rows[0]) {
        value = [orders_id, id.id, medicationId, quantity, (Number(obat.harga) * parseInt(quantity)) + deliveryPrice, user.address || "", deliveryMethod, email, paymentMethod, Number(obat.harga) * parseInt(quantity), 0];
    } else {
        value = [orders_id, id.id, medicationId, quantity, (Number(results.rows[0].harga_setelah_diskon) * parseInt(quantity)), user.address || "", deliveryMethod, email, paymentMethod, Number(results.rows[0].harga_awal) * parseInt(quantity), Number(results.rows[0].diskon)]
    }
    try {
        await pool.query(query, value);
        return new Response(JSON.stringify({ "message": "ok" }), { status: 200, headers: { 'content-type': 'application/json' } });
    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ "message": "error" }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
}

