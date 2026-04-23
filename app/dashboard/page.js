"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { Rocket, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens();
    }
  }, [connected, publicKey]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens?wallet=${publicKey.toBase58()}`);
      const data = await res.json();
      setTokens(data.tokens || []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="flex-grow bg-slate-50 min-h-screen"></div>;
  }

  if (!connected) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="card max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Connect your Wallet</h1>
          <p className="text-slate-600 mb-8">Please connect your Solana wallet to access your token dashboard.</p>
          <WalletMultiButton className="!mx-auto !bg-primary hover:!bg-primary-dark !rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage and view all your launched tokens on Devnet.</p>
          </div>
          <Link href="/token/create" className="btn-primary flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Launch New Token
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-48 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : tokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <TokenCard key={token.mint_address} token={token} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-20 bg-white border-dashed border-2">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Rocket className="text-slate-300 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tokens found</h3>
            <p className="text-slate-500 mb-8">You haven't launched any tokens yet. Start your journey now!</p>
            <Link href="/token/create" className="btn-primary inline-flex items-center gap-2">
              Create First Token
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TokenCard({ token }) {
  return (
    <div className="card hover:translate-y-[-4px] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl uppercase">
          {token.image_url ? (
            <img src={token.image_url} alt={token.name} className="w-full h-full rounded-xl object-cover" />
          ) : (
            token.symbol[0]
          )}
        </div>
        <Link 
          href={`https://solscan.io/token/${token.mint_address}?cluster=devnet`}
          target="_blank"
          className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
      <h3 className="text-lg font-bold text-slate-900">{token.name}</h3>
      <p className="text-primary font-semibold text-sm mb-4">${token.symbol}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
          {token.mint_address}
        </div>
        <Link href={`/token/${token.mint_address}`} className="text-sm font-bold text-slate-900 hover:text-primary transition-colors flex items-center gap-1">
          View Page <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
