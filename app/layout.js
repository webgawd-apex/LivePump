import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "../components/WalletProvider";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LivePump | Solana Token Launcher",
  description: "Deploy your Solana token in seconds with a few clicks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
