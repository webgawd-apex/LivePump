import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });
    }

    const result = await query(
      `SELECT t.* FROM tokens t 
       JOIN users u ON t.user_id = u.id 
       WHERE u.wallet_address = $1 
       ORDER BY t.created_at DESC`,
      [wallet]
    );

    return NextResponse.json({ tokens: result.rows });

  } catch (err) {
    console.error('Fetch tokens error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
