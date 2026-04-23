import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const status = {
    database: 'Checking...',
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
      NEXT_PUBLIC_SOLANA_RPC: process.env.NEXT_PUBLIC_SOLANA_RPC ? 'PRESENT' : 'MISSING',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await query('SELECT NOW()');
    if (res.rows.length > 0) {
      status.database = 'CONNECTED';
    } else {
      status.database = 'ERROR (No rows)';
    }
  } catch (err) {
    status.database = `ERROR: ${err.message}`;
  }

  return NextResponse.json(status);
}
