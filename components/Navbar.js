"use client";
import React from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Navbar() {
  return (
    <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Live<span className="text-primary">Pump</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <WalletMultiButton className="!bg-primary hover:!bg-primary-dark !rounded-lg !h-10 !text-sm !font-semibold !transition-all" />
        </div>
      </div>
    </nav>
  );
}
