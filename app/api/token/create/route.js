import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { name, symbol, description, supply, image, wallet, mintAddress, signature } = await req.json();

    if (!name || !symbol || !wallet) {
      return NextResponse.json({ error: 'Missing required tokens fields' }, { status: 400 });
    }

    // 1. Find user by wallet address
    let userResult = await query('SELECT id FROM users WHERE wallet_address = $1', [wallet]);
    
    if (userResult.rows.length === 0) {
      // Create user if not exists (graceful fallback)
      userResult = await query(
        'INSERT INTO users (wallet_address) VALUES ($1) RETURNING id',
        [wallet]
      );
    }

    const userId = userResult.rows[0].id;

    // 2. Save token to database
    const finalMint = mintAddress || 'DevMint' + Math.random().toString(36).substring(7);
    const finalSig = signature || 'DevSig' + Math.random().toString(36).substring(7);

    // Validate symbol length
    if (symbol.length > 10) {
      return NextResponse.json({ error: 'Symbol too long (max 10 chars)' }, { status: 400 });
    }

    const tokenResult = await query(
      `INSERT INTO tokens (user_id, mint_address, name, symbol, description, image_url, total_supply) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, finalMint, name, symbol, description, image, supply]
    );

    console.log(`Token created successfully: ${name} (${finalMint})`);

    return NextResponse.json({
      success: true,
      token: tokenResult.rows[0],
      mintAddress: finalMint,
      signature: finalSig
    });

  } catch (err) {
    console.error('CRITICAL ERROR - Token create API:', err);
    return NextResponse.json({ 
      error: 'Failed to launch token. Please check your connection and try again.',
      details: err.message 
    }, { status: 500 });
  }
}
