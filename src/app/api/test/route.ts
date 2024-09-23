// pages/api/locations.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import turf from "@turf/turf"
import haversine from 'haversine'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseInt(searchParams.get('lat') || '1');
  const lng = parseInt(searchParams.get('lng') || '1');
  const max_distance = parseInt(searchParams.get('max_distance') || '1');

  if (!lat || !lng || !max_distance) {
    return NextResponse.json({ error: 'Missing required parameters' });
  }

  try {
    const result = await pool.query('SELECT id, name, latitude, longitude FROM locations');
    const locations = result.rows;

    const start = {
      latitude: -8.6825862,
      longitude: 115.2211584
    }

    const end = {
      latitude: lat,
      longitude: lng
    }

    console.log(haversine(start, end))

    return NextResponse.json({status: 200});
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch locations' });
  }
}
