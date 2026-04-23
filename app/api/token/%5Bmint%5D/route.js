import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { mint } = params;

    if (!mint) {
      return NextResponse.json({ error: 'Missing mint address' }, { status: 400 });
    }

    const result = await query(
      `SELECT * FROM tokens WHERE mint_address = $1`,
      [mint]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    return NextResponse.json({ token: result.rows[0] });

  } catch (err) {
    console.error('Fetch token error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
