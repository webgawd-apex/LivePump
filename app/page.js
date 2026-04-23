"use client";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Link from "next/link";
import { Rocket, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Launch your Solana Token <br />
            <span className="text-primary">in Seconds.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            The most advanced, fast, and secure token launchpad on Solana Devnet. 
            No coding required. Just pure pump.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-lg">
              Get Started <Rocket className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="Instant Deployment"
              description="Deploy SPL tokens with metadata in a single transaction on Devnet."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Secure & Audited"
              description="Battle-tested contracts using the official SPL Token and Metaplex programs."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-primary" />}
              title="Global Reach"
              description="Your token is instantly available for trading and viewing on the dynamic dashboard."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-16">
          <Stat label="Tokens Created" value="0" />
          <Stat label="Total Volume" value="0.00 SOL" />
          <Stat label="Active Users" value="0" />
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">© 2024 LivePump. Strictly Devnet. No real SOL involved.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
