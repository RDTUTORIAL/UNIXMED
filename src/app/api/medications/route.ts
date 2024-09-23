import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const offset = (page - 1) * limit;
  try {
    const totalQuery = `SELECT COUNT(*) FROM medications WHERE LOWER(name) LIKE $1;`;
    const totalResult = await pool.query(totalQuery, [`%${decodeURIComponent(searchQuery)}%`]);
    const total = parseInt(totalResult.rows[0].count, 10);
    const dataQuery = `SELECT * FROM medications WHERE LOWER(name) LIKE $1 ORDER BY id LIMIT $2 OFFSET $3;`;
    const dataResult = await pool.query(dataQuery, [`%${decodeURIComponent(searchQuery)}%`, limit, offset]);
    return NextResponse.json({
      total,
      page,
      limit,
      data: dataResult.rows,
    });
  } catch (error) {
    console.log(error)
    console.error("Error fetching medications:", error);
    return NextResponse.error();
  }
}
