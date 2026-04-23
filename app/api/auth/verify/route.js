import { NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { address, signature, nonce } = await req.json();

    if (!address || !signature || !nonce) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert address and signature to Uint8Array
    const publicKey = bs58.decode(address);
    const signatureUint8 = bs58.decode(signature);
    const messageUint8 = new TextEncoder().encode(`Sign this message to authenticate with LivePump: ${nonce}`);

    // Verify signature
    const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Signature is valid, handle user in database
    // 1. Check if user exists
    let userResult = await query('SELECT * FROM users WHERE wallet_address = $1', [address]);
    
    if (userResult.rows.length === 0) {
      // 2. Create user if not exists
      userResult = await query(
        'INSERT INTO users (wallet_address) VALUES ($1) RETURNING *',
        [address]
      );
    }

    const user = userResult.rows[0];

    // In a real app, you would set a session cookie/JWT here
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        address: user.wallet_address
      }
    });

  } catch (err) {
    console.error('Auth verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
