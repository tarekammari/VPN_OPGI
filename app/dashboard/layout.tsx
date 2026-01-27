'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Server, Download, Settings, LogOut, PlusCircle } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: Server, label: 'My VPNs', href: '/dashboard/vpns' },
        { icon: Download, label: 'Download Apps', href: '/dashboard/download' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-white font-sans antialiased">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl fixed h-full hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            OPGI VPN
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="mb-8">
                        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div>
                        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actions</p>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left">
                            <PlusCircle className="w-5 h-5 text-cyan-400" />
                            <span className="font-medium">Create New VPN</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen bg-slate-950">
                {children}
            </main>
        </div>
    );
}
