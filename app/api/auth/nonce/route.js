import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  // Generate a random nonce
  const nonce = crypto.randomBytes(32).toString('hex');
  
  // Set the nonce in a secure, HTTP-only cookie or just return it for the client to hold
  // For this MVP, we return it. In a full production app, we'd store it in a session.
  return NextResponse.json({ nonce });
}
