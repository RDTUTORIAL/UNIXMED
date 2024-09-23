import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const offset = (page - 1) * limit;

  try {
    const totalQuery = `SELECT COUNT(*) FROM articles WHERE TRIM(LOWER(title)) LIKE $1;`;
    const totalResult = await pool.query(totalQuery, [`%${searchQuery}%`]);
    const total = parseInt(totalResult.rows[0].count, 10);

    const dataQuery = `
      SELECT * FROM articles 
      WHERE TRIM(LOWER(title)) LIKE $1 
      ORDER BY article_id DESC 
      LIMIT $2 OFFSET $3;`;
    const dataResult = await pool.query(dataQuery, [`%${searchQuery}%`, limit, offset]);

    return NextResponse.json({
      total,
      page,
      limit,
      data: dataResult.rows,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.error();
  }
}
