import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SD-Share | Real-Time P2P File Sharing',
  description: 'Transfer files of any size directly between users. No server storage, fully real-time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen selection:bg-indigo-500/30 antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
