import pool from "./db";
import { User } from "./interface";

export async function getUser(id: string){
    const results = await pool.query(`SELECT * FROM users WHERE id = '${id}'`)
    if(results.rows?.length > 0){
        return results.rows[0]
    }else{
        return false
    }
}

export async function insertUser(data: User){
    const query = `INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, 'patient') RETURNING *`    
    const results = await pool.query(query, [data.id, data.name, data.email, data.password])
}

export async function getObat(id: number | string){
    const results = await pool.query(`SELECT * FROM medications WHERE id = ${id}`)
    if(results.rows?.length > 0){
        return results.rows[0]
    }else{
        return false
    }
}