'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, ArrowRight, Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateAdminKey } from '../../lib/store';

export default function AdminLoginPage() {
    const router = useRouter();
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate validation delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (validateAdminKey(key)) {
            // In real app, set a cookie. Here we just redirect.
            localStorage.setItem('admin_authenticated', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid Security Key. Access Denied.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-purple-800 mb-4 shadow-lg shadow-red-900/30">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-red-400 font-mono text-sm">SECURE_LEVEL_3 // RESTRICTED</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 font-mono">ENTER SECURITY KEY</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white font-mono placeholder-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-2 font-mono"
                            >
                                [ERROR] {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold tracking-wider hover:shadow-lg hover:shadow-red-900/20 transition-all focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                VERIFYING...
                            </>
                        ) : (
                            <>
                                AUTHENTICATE
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-600 font-mono">
                        System ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
