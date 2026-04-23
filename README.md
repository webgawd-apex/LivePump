# LivePump - Solana Token Launchpad (MVP)

A production-ready MVP for launching Solana tokens on Devnet. Built with Next.js, Neon PostgreSQL, and Tailwind CSS.

## 🚀 Features

- **Wallet Connection**: Integrated with Solana Wallet Adapter (Devnet).
- **Token Launchpad**: Create SPL tokens with metadata (Metaplex compatible).
- **User Dashboard**: Track all your launched tokens in one place.
- **Dynamic Token Pages**: Public pages for every token at `/token/[mint]`.
- **Premium UI**: Clean "White + Green" aesthetic with smooth animations.
- **Neon DB Integration**: High-performance PostgreSQL backend for token persistence.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Blockchain**: @solana/web3.js, @solana/spl-token, @metaplex-foundation/js.
- **Backend**: Next.js API Routes.
- **Database**: Neon PostgreSQL (via `pg`).
- **Network**: Solana Devnet.

## 📋 Setup Instructions

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   DATABASE_URL="your_neon_connection_string"
   NEXT_PUBLIC_SOLANA_NETWORK="devnet"
   NEXT_PUBLIC_SOLANA_RPC="https://api.devnet.solana.com"
   ```

3. **Initialize Database**:
   Run the schema initialization script:
   ```bash
   node scripts/init-db.js
   ```

4. **Run Development Server**:
   ```bash
   pnpm dev
   ```

5. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚠️ Important Notes

- This MVP runs strictly on **Solana Devnet**.
- Ensure your wallet is set to Devnet and has Devnet SOL for transaction fees.
- Token creation involves on-chain transactions and database persistence.
