'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Plus,
    MapPin,
    Globe,
    MoreVertical,
    Download,
    CheckCircle,
    Network
} from 'lucide-react';

// Types
interface VPNConfig {
    id: string;
    name: string;
    location: string;
    ipRange: string;
    ips: string[];
    status: 'active' | 'inactive';
    createdAt: string;
}

export default function DashboardPage() {
    const [vpns, setVpns] = useState<VPNConfig[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVpnName, setNewVpnName] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('US East');

    // Logic to generate 100 IPs
    const generateIPs = (baseIP: string) => {
        return Array.from({ length: 100 }, (_, i) => `${baseIP}.${i + 2}`);
    };

    const handleCreateVPN = () => {
        // Simulate creating a VPN with a dedicated subnet
        const subnet = Math.floor(Math.random() * 255);
        const baseIP = `10.8.${subnet}`;

        const newVPN: VPNConfig = {
            id: Math.random().toString(36).substr(2, 9),
            name: newVpnName || `My VPN #${vpns.length + 1}`,
            location: selectedLocation,
            ipRange: `${baseIP}.0/24`,
            ips: generateIPs(baseIP),
            status: 'active',
            createdAt: new Date().toLocaleDateString(),
        };

        setVpns([newVPN, ...vpns]);
        setNewVpnName('');
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Network</h1>
                    <p className="text-gray-400">Manage your private VPNs and IP allocations</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create New VPN
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Active VPNs</h3>
                        <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold text-white">{vpns.length}</div>
                    <div className="text-sm text-green-400 mt-2">+0 this month</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Total IPs Allocated</h3>
                        <Network className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-4xl font-bold text-white">{vpns.length * 100}</div>
                    <div className="text-sm text-gray-500 mt-2">100 per VPN instance</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Data Transferred</h3>
                        <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-4xl font-bold text-white">0 GB</div>
                    <div className="text-sm text-gray-500 mt-2">Real-time usage</div>
                </div>
            </div>

            {/* Empty State */}
            {vpns.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No VPNs Created Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        Create your first secure private network to get 100 dedicated static IPs instantly.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
                    >
                        Create Your First VPN
                    </button>
                </div>
            ) : (
                /* VPN List */
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {vpns.map((vpn) => (
                            <motion.div
                                key={vpn.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{vpn.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {vpn.location}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                                <span className="text-cyan-400">{vpn.ipRange}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-all border border-white/10">
                                            <Download className="w-4 h-4" />
                                            Config
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* IP Grid Preview */}
                                <div className="p-6 bg-black/20">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Network className="w-4 h-4" />
                                        Allocated IPs (100 Total)
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {vpn.ips.map((ip) => (
                                            <div key={ip} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded border border-white/5 text-xs text-gray-300 font-mono">
                                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                                {ip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-slate-900 border border-white/10 rounded-2xl p-6 z-50 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Create Private VPN</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">VPN Name</label>
                                    <input
                                        type="text"
                                        value={newVpnName}
                                        onChange={(e) => setNewVpnName(e.target.value)}
                                        placeholder="e.g., Office Network"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['US East', 'Europe (Germany)', 'Asia (Japan)', 'Australia'].map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => setSelectedLocation(loc)}
                                                className={`px - 4 py - 3 rounded - xl border text - sm font - medium transition - all text - left ${selectedLocation === loc
                                                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Includes 100 Dedicated IPs</p>
                                            <p className="text-xs text-gray-400 mt-1">A full /24 subnet will be automatically allocated to this VPN instance.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateVPN}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                    >
                                        Create VPN
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
