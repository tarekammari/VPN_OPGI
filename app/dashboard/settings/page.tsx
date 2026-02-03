'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Check } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [settings, setSettings] = useState({
        displayName: '',
        emailNotification: true,
        reportNotification: false
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (e) {
            console.error("Failed to save", e);
        }
        setSaving(false);
    };

    if (loading) return <div className="text-gray-400">Loading settings...</div>;

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
                                value={settings.displayName}
                                onChange={(e) => handleChange('displayName', e.target.value)}
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
                            <input
                                type="checkbox"
                                checked={settings.emailNotification}
                                onChange={(e) => handleChange('emailNotification', e.target.checked)}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-offset-0 focus:ring-0"
                            />
                            <span className="text-gray-300">Email me on new device login</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.reportNotification}
                                onChange={(e) => handleChange('reportNotification', e.target.checked)}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-offset-0 focus:ring-0"
                            />
                            <span className="text-gray-300">Email me weekly activity reports</span>
                        </label>
                    </div>
                </div>

                <div className="pt-6 flex gap-3 items-center">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                        {success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    </button>
                    {success && <span className="text-green-400 text-sm">Settings updated successfully</span>}
                </div>
            </motion.div>
        </div>
    );
}
