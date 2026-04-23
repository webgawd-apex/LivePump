"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { Rocket, Info, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Connection, 
  clusterApiUrl
} from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

export default function CreateToken() {
  const wallet = useWallet();
  const { connected, publicKey, sendTransaction } = wallet;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [success, setSuccess] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: "1000000",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "image" && e.target.value) {
      setImagePreview(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setLoading(true);
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('devnet'), 'confirmed');
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
      
      console.log("Starting on-chain deployment...");

      // For the MVP, we use the Metaplex SDK to create the SFT/NFT which acts as a token launch
      // This will trigger the wallet popup automatically.
      const { nft } = await metaplex.nfts().create({
        name: formData.name,
        symbol: formData.symbol,
        uri: formData.image || "https://arweave.net/dummy-uri",
        sellerFeeBasisPoints: 0,
        isMutable: true,
      });

      const mintAddress = nft.address.toBase58();
      const signature = nft.mintAddress.toBase58(); // Placeholder for sig if not returned directly

      // Save to database
      const response = await fetch("/api/token/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          wallet: publicKey.toBase58(),
          mintAddress: mintAddress,
          signature: signature // In Metaplex create, nft.address is the mint
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTxSig(mintAddress);
      } else {
        throw new Error(data.error || "Failed to save token to database");
      }
    } catch (err) {
      console.error('FRONTEND ERROR:', err);
      alert(err.message || "Something went wrong during token creation. Please check your wallet.");
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
           <WalletMultiButton className="!mx-auto !bg-primary" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="card max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Token Launched!</h1>
          <p className="text-slate-600 mb-8">Successfully created {formData.name} (${formData.symbol}) on Solana Devnet.</p>
          
          <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left">
            <p className="text-xs font-mono text-slate-500 break-all">{txSig}</p>
          </div>

          <div className="flex flex-col gap-3">
             <Link href="/dashboard" className="btn-primary">View Dashboard</Link>
             <Link href={`https://solscan.io/token/${txSig}?cluster=devnet`} target="_blank" className="text-sm font-bold text-primary">View on Solscan</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 pb-20">
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center">
        <div className="max-w-3xl mx-auto w-full px-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <span className="font-bold text-slate-900">Launch New Token</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Token Details</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Token Name</label>
                  <input 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Pepe" 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Symbol</label>
                  <input 
                    name="symbol"
                    required
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="PEPE" 
                    className="input-field uppercase" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Supply</label>
                <input 
                  name="supply"
                  type="number"
                  required
                  value={formData.supply}
                  onChange={handleChange}
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell the world about your token..." 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Image</label>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Add image link</label>
                      <input 
                        name="image"
                        value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                        onChange={handleChange}
                        placeholder="https://ipfs.io/..." 
                        className="input-field" 
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Upload Image</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="input-field file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="w-32 h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-primary/80">
                Token creation will cost roughly 0.02 SOL for rent and account fees on Devnet. 
                Ensure you have enough Devnet SOL.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Launching Token...
                </>
              ) : (
                <>
                  Launch Token <Rocket className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
