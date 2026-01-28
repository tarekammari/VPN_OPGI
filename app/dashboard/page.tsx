'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Monitor,
    Smartphone,
    Globe,
    MoreVertical,
    Download,
    CheckCircle,
    Network,
    Clock,
    AlertTriangle,
    Lock,
    Plus,
    Laptop,
    Server,
    Wifi
} from 'lucide-react';
// import { submitRequest, getRequests, getMachines, registerMachine, Machine } from '../../lib/store';
// Using API types locally or from shared location is better, but defining inline for speed
interface Machine {
    id: string;
    hostname: string;
    os: 'windows' | 'linux' | 'macos' | 'android' | 'ios' | 'other';
    ip: string;
    lastSeen: string;
    status: 'connected' | 'disconnected' | 'new';
    authKey: string;
}

export default function DashboardPage() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHostname, setNewHostname] = useState('');
    const [newOS, setNewOS] = useState<Machine['os']>('windows');

    // Request Logic (Simulated for now, can move to API too)
    const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('approved'); // Default approved for demo flow
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const refreshData = async () => {
        try {
            const res = await fetch('/api/machines');
            if (res.ok) {
                const data = await res.json();
                setMachines(data);
            }
        } catch (e) {
            console.error("Failed to fetch machines", e);
        }
    };

    // Poll for updates every 2 seconds to see live status changes
    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // await submitRequest(userEmail || 'demo@user.com', userName || 'Demo User');
        setRequestStatus('pending');
        // Simulate approval
        setTimeout(() => setRequestStatus('approved'), 2000);
    };

    const handleRegisterMachine = async () => {
        if (!newHostname) return;

        await fetch('/api/machines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hostname: newHostname, os: newOS })
        });

        setNewHostname('');
        setIsModalOpen(false);
        refreshData();
    };

    const handleDownloadConfig = (machine: Machine) => {
        const configContent = `
# VPN_OPGI Configuration
# Machine: ${machine.hostname}
# Static IP: ${machine.ip}
# Auth Key: ${machine.authKey}

[Interface]
PrivateKey = (Hidden)
Address = ${machine.ip}/32
DNS = 100.100.100.100

[Peer]
PublicKey = (Server_Public_Key)
Endpoint = vpn.opgi.dz:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
        `.trim();

        const element = document.createElement("a");
        const file = new Blob([configContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${machine.hostname}_vpn_config.conf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const getIcon = (os: Machine['os']) => {
        switch (os) {
            case 'windows': return <Monitor className="w-5 h-5 text-blue-400" />;
            case 'macos': return <Laptop className="w-5 h-5 text-gray-400" />;
            case 'linux': return <Server className="w-5 h-5 text-yellow-400" />;
            case 'android': return <Smartphone className="w-5 h-5 text-green-400" />;
            case 'ios': return <Smartphone className="w-5 h-5 text-gray-300" />;
            default: return <Globe className="w-5 h-5 text-purple-400" />;
        }
    };

    // --- VIEW: Request Access (If not approved) ---
    if (requestStatus === 'none' || requestStatus === 'pending' || requestStatus === 'rejected') {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Secure Network Access</h1>
                    <p className="text-gray-400">Request permission from the administrator to join the private mesh.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden"
                >
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {requestStatus === 'none' && (
                        <form onSubmit={handleRequestSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    required
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={userEmail}
                                    onChange={e => setUserEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-500/20">
                                Submit Request
                            </button>
                        </form>
                    )}

                    {requestStatus === 'pending' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Request Pending</h2>
                            <p className="text-gray-400 mb-6">Your request has been sent securely to the administrator. Please wait for approval.</p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm font-mono border border-yellow-500/20">
                                STATUS: AWAITING_APPROVAL
                            </div>
                        </div>
                    )}

                    {requestStatus === 'rejected' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Request Declined</h2>
                            <p className="text-gray-400">The administrator has declined your request for VPN access. Please contact support.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    // --- VIEW: Dashboard (If Approved) ---
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">my Machines</h1>
                    <p className="text-gray-400">Manage your connected devices and static IPs</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Machine
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Network Status</h3>
                        <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            ONLINE
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">Mesh functionality active</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Machines</h3>
                        <Monitor className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold text-white">{machines.length}</div>
                    <div className="text-sm text-gray-500 mt-2">Registered devices</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Global IP Range</h3>
                        <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-xl font-mono font-bold text-white">100.64.x.x</div>
                    <div className="text-sm text-gray-500 mt-2">CGNAT Static Assignment</div>
                </div>
            </div>

            {/* Empty State */}
            {machines.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Monitor className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Machines Connected</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        Add your first device to the mesh to get a static IP and start connecting.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
                    >
                        Register a Device
                    </button>
                </div>
            ) : (
                /* Machines List table style */
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Machine Name</th>
                                    <th className="px-6 py-4">Static IP</th>
                                    <th className="px-6 py-4">OS</th>
                                    <th className="px-6 py-4">Last Seen</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {machines.map((machine) => (
                                        <motion.tr
                                            key={machine.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${machine.status === 'connected' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                    <span className="font-bold text-white">{machine.hostname}</span>
                                                    {machine.status === 'new' && (
                                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded uppercase font-bold">New</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded text-sm">
                                                    {machine.ip}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    {getIcon(machine.os)}
                                                    <span className="capitalize">{machine.os}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {machine.lastSeen}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDownloadConfig(machine)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-cyan-400 font-medium transition-all"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Connect
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Machine Modal */}
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
                            <h2 className="text-2xl font-bold text-white mb-6">Add New Machine</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Hostname</label>
                                    <input
                                        type="text"
                                        value={newHostname}
                                        onChange={(e) => setNewHostname(e.target.value)}
                                        placeholder="e.g., Home PC, My iPhone"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Operating System</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['windows', 'macos', 'linux', 'android', 'ios', 'other'].map((os) => (
                                            <button
                                                key={os}
                                                onClick={() => setNewOS(os as Machine['os'])}
                                                className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${newOS === os
                                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {getIcon(os as Machine['os'])}
                                                <span className="capitalize">{os}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <div className="flex items-start gap-3">
                                        <Wifi className="w-5 h-5 text-purple-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Auto-assigned Static IP</p>
                                            <p className="text-xs text-gray-400 mt-1">This device will receive a permanent IP from the 100.64.0.x range.</p>
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
                                        onClick={handleRegisterMachine}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                    >
                                        Register Machine
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
