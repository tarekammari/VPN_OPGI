import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'OPGI VPN - Secure & Fast',
    description: 'The world\'s fastest and most secure VPN service.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} font-sans antialiased text-slate-100 bg-slate-950 selection:bg-cyan-500/30 selection:text-cyan-200`}>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
