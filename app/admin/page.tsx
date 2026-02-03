'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '../lib/actions';
import { Shield, Key, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/20"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400">Secure Gateway // Authorized Personnel Only</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
                >
                    <form action={dispatch} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Identity</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@opgi.dz"
                                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Passphrase</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {errorMessage}
                            </div>
                        )}

                        <LoginButton />
                    </form>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm font-mono">
                        SYSTEM_ID: OPGI_VPN_CORE_v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                'Authenticating...'
            ) : (
                <>
                    Access System <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}
