"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rocket, Globe, Twitter, Send, ExternalLink, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function TokenPage() {
  const { mint } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mint) {
      fetchToken();
    }
  }, [mint]);

  const fetchToken = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/token/${mint}`);
      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      console.error("Error fetching token:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50">
        <RefreshCcw className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Token not found</h1>
        <Link href="/dashboard" className="text-primary font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 pb-20">
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <span className="font-bold text-slate-900">{token.name} (${token.symbol})</span>
          </div>
          <div className="flex items-center gap-3">
             <Link href={`https://solscan.io/token/${token.mint_address}?cluster=devnet`} target="_blank" className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm">
                <ExternalLink className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
             <div className="card !p-0 overflow-hidden">
                <div className="h-64 bg-slate-900 relative">
                  {token.image_url ? (
                    <img src={token.image_url} alt={token.name} className="w-full h-full object-cover opacity-50" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <Rocket className="text-white/20 w-32 h-32" />
                    </div>
                  )}
                  <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-2xl shadow-xl">
                    <div className="w-32 h-32 bg-primary/10 rounded-xl flex items-center justify-center text-4xl font-bold uppercase overflow-hidden">
                       {token.image_url ? (
                         <img src={token.image_url} alt={token.name} className="w-full h-full object-cover" />
                       ) : (
                         token.symbol[0]
                       )}
                    </div>
                  </div>
                </div>
                <div className="pt-20 px-8 pb-8">
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-4xl font-extrabold text-slate-900">{token.name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">{token.symbol}</span>
                        <span className="text-slate-400 text-xs font-mono">{token.mint_address}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <SocialLink icon={<Globe className="w-4 h-4" />} />
                       <SocialLink icon={<Twitter className="w-4 h-4" />} />
                       <SocialLink icon={<Send className="w-4 h-4" />} />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">{token.description}</p>
                </div>
             </div>

             <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Token Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <Metric label="Supply" value={parseInt(token.total_supply).toLocaleString()} />
                  <Metric label="Market Cap" value="$0.00" />
                  <Metric label="Price" value="$0.0000" />
                  <Metric label="Liquidity" value="0.00 SOL" />
                </div>
             </div>
          </div>

          {/* Swap / Interaction */}
          <div className="space-y-6">
             <div className="card border-primary/20 shadow-primary/5 ring-4 ring-primary/5">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  Swap Token <RefreshCcw className="w-5 h-5 text-primary" />
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase">You Pay</label>
                    <div className="flex items-center justify-between mt-1">
                      <input className="bg-transparent text-xl font-bold outline-none w-1/2" placeholder="0.0" />
                      <div className="flex items-center gap-2 font-bold px-2 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-[10px] text-orange-600">S</div>
                        SOL
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="p-2 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase">You Receive</label>
                    <div className="flex items-center justify-between mt-1">
                      <input className="bg-transparent text-xl font-bold outline-none w-1/2" placeholder="0.0" readOnly />
                      <div className="flex items-center gap-2 font-bold px-2 py-1 bg-white rounded-lg shadow-sm border border-slate-100 italic">
                        {token.symbol}
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-4 text-lg mt-4 shadow-xl shadow-primary/20">
                    Buy {token.symbol}
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4">
                    Jupiter integration fallback active. Devnet liquidity required.
                  </p>
                </div>
             </div>

             <div className="card bg-slate-900 text-white border-0">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contract Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mint Address</p>
                    <p className="text-xs font-mono break-all text-slate-200">{token.mint_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Created At</p>
                    <p className="text-sm">{new Date(token.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ icon }) {
  return (
    <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-primary hover:bg-primary/5 transition-all">
      {icon}
    </button>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
