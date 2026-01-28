'use client';

import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account preferences and global configurations.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
            >
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Profile Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                            <input
                                type="text"
                                defaultValue="Demo User"
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                defaultValue="demo@user.com"
                                disabled
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-offset-0 focus:ring-0" />
                            <span className="text-gray-300">Email me on new device login</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-offset-0 focus:ring-0" />
                            <span className="text-gray-300">Email me weekly activity reports</span>
                        </label>
                    </div>
                </div>

                <div className="pt-6">
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
