'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Key, Lock, Check, X, RefreshCw, Eye, EyeOff, Download, Server, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRequests, updateRequestStatus, UserRequest, createAdminKey, getAdminKeys, AdminKey } from '../../../lib/store';

// Mock VPN Store for Admin (In real app, this would be in lib/store)
interface VPNInstance {
    id: string;
    name: string;
    location: string;
    status: 'active' | 'inactive';
    ipRange: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<UserRequest[]>([]);
    const [adminKeys, setAdminKeys] = useState<AdminKey[]>([]);
    const [showEncrypted, setShowEncrypted] = useState(true);

    // VPN Management State
    const [adminVpns, setAdminVpns] = useState<VPNInstance[]>([
        { id: 'v1', name: 'Master Node - US', location: 'New York', status: 'active', ipRange: '10.8.0.0/24' }
    ]);
    const [showVpnModal, setShowVpnModal] = useState(false);
    const [newVpnName, setNewVpnName] = useState('');

    // Refresh data
    const refreshData = async () => {
        setRequests(await getRequests());
        setAdminKeys(getAdminKeys());
    };

    useEffect(() => {
        if (localStorage.getItem('admin_authenticated') !== 'true') {
            router.push('/admin');
        }
        refreshData();
    }, []);

    const handleApprove = async (id: string) => {
        await updateRequestStatus(id, 'approved');
        refreshData();
    };

    const handleRefuse = async (id: string) => {
        await updateRequestStatus(id, 'rejected');
        refreshData();
    };

    const handleGenerateKey = () => {
        const label = prompt("Enter a label for this key (e.g., 'Backup Admin')");
        if (label) {
            const newKey = createAdminKey(label);
            refreshData();

            // Auto-download key file
            const element = document.createElement("a");
            const file = new Blob([newKey], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `admin_key_${label.replace(/\s+/g, '_')}_${Date.now()}.key`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const handleCreateVpn = () => {
        if (!newVpnName) return;
        const newVpn: VPNInstance = {
            id: Math.random().toString(36).substr(2, 9),
            name: newVpnName,
            location: 'Admin Assigned',
            status: 'active',
            ipRange: `10.8.${Math.floor(Math.random() * 255)}.0/24`
        };
        setAdminVpns([...adminVpns, newVpn]);
        setNewVpnName('');
        setShowVpnModal(false);
    };

    const handleDeleteVpn = (id: string) => {
        if (confirm('Are you sure you want to terminate this VPN node?')) {
            setAdminVpns(adminVpns.filter(v => v.id !== id));
        }
    };

    // Dummy Encryption Visualizer
    const renderData = (text: string) => {
        if (!showEncrypted) return text;
        return text.split('').map(c => Math.random() > 0.5 ? '•' : '*').join('');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-8">
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/20">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Centre de Commandement Admin</h1>
                        <p className="text-red-400 font-mono text-sm">CONNEXION CHIFFRÉE // SÉCURISÉ</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowEncrypted(!showEncrypted)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                        {showEncrypted ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
                        <span className="text-sm">{showEncrypted ? 'Vue Déchiffrée' : 'Vue Chiffrée'}</span>
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('admin_authenticated'); router.push('/admin'); }}
                        className="px-4 py-2 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Requests & VPNs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* REQUESTS SECTION */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-400" />
                                Demandes d'accès
                            </h2>
                            <div className="text-sm text-gray-400 font-mono">
                                {requests.filter(r => r.status === 'pending').length} EN ATTENTE
                            </div>
                        </div>

                        <div className="space-y-4">
                            {requests.length === 0 && (
                                <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-xl text-gray-500">
                                    Aucune demande trouvée.
                                </div>
                            )}
                            {requests.map(req => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-white">
                                                {renderData(req.name)}
                                            </h3>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {req.status === 'pending' ? 'En attente' : req.status === 'approved' ? 'Validé' : 'Refusé'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-mono">{renderData(req.email)}</p>
                                        <p className="text-xs text-gray-600 mt-1">ID: {req.id}</p>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRefuse(req.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition"
                                                title="Refuser"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg shadow-green-500/20 transition"
                                            >
                                                <Check className="w-4 h-4" />
                                                Valider
                                            </button>
                                        </div>
                                    )}
                                    {req.status !== 'pending' && (
                                        <div className="text-sm text-gray-500 italic">
                                            Traité
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* VPN MANAGEMENT SECTION */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Server className="w-5 h-5 text-purple-400" />
                                Gestion Réseau
                            </h2>
                            <button
                                onClick={() => setShowVpnModal(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition"
                            >
                                <Plus className="w-4 h-4" /> Nouveau Nœud
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {adminVpns.map(vpn => (
                                <div key={vpn.id} className="bg-black/40 border border-purple-500/20 p-4 rounded-xl relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <h3 className="font-bold">{vpn.name}</h3>
                                        </div>
                                        <button onClick={() => handleDeleteVpn(vpn.id)} className="text-gray-500 hover:text-red-500 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-400 font-mono">
                                        <p>LOC: {vpn.location}</p>
                                        <p>NET: {vpn.ipRange}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Create VPN Modal */}
                        {showVpnModal && (
                            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-96">
                                    <h3 className="text-lg font-bold mb-4">Déployer un nouveau nœud VPN</h3>
                                    <input
                                        value={newVpnName}
                                        onChange={(e) => setNewVpnName(e.target.value)}
                                        placeholder="Nom du Nœud (ex: Serveur-01)"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 mb-4 text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowVpnModal(false)} className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20">Annuler</button>
                                        <button onClick={handleCreateVpn} className="flex-1 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 font-bold">Déployer</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Col: Keys & System */}
                <div className="space-y-8">
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Key className="w-5 h-5 text-purple-400" />
                            Clés Admin
                        </h2>
                        <div className="space-y-3 mb-6">
                            {adminKeys.map((k, i) => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{k.label}</span>
                                        <span>{new Date(k.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="font-mono text-sm text-purple-300 break-all select-all flex items-center justify-between gap-2">
                                        <span className="truncate">{showEncrypted ? '••••••••••' : k.key}</span>
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleGenerateKey}
                            className="w-full py-3 bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Générer & Télécharger Clé
                        </button>
                    </div>

                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Lock className="w-5 h-5 text-gray-400" />
                            État du Système
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Encryption</span>
                                <span className="text-green-400 font-bold flex items-center gap-1">
                                    <Check className="w-4 h-4" /> AES-256-GCM
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Database</span>
                                <span className="text-yellow-400 font-bold">Local / Mock</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Environment</span>
                                <span className="text-blue-400 font-bold">Dev</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
