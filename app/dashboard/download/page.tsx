'use client';

import { motion } from 'framer-motion';
import { Apple, Monitor, Smartphone, Terminal, Download } from 'lucide-react';

export default function DownloadPage() {
    const clients = [
        { os: 'Windows', icon: Monitor, version: 'v1.0.0', description: 'Real Desktop Application', file: 'VPN_OPGI_Client.zip', isReal: true },
        { os: 'macOS', icon: Apple, version: 'v1.4.2', description: 'Requires macOS 11+', file: 'VPN_OPGI_Installer_v1.4.2.dmg' },
        { os: 'iOS', icon: Smartphone, version: 'App Store', description: 'Download TestFlight or App Store', link: 'https://apps.apple.com' },
        { os: 'Android', icon: Smartphone, version: 'Play Store', description: 'Google Play or APK', link: 'https://play.google.com' },
        { os: 'Linux', icon: Terminal, version: 'CLI v1.3', description: 'Debian/Ubuntu/CentOS', file: 'vpn-opgi-install.sh' },
    ];

    const handleDownload = (client: typeof clients[0]) => {
        if (client.link) {
            window.open(client.link, '_blank');
            return;
        }

        if (client.isReal) {
            // Serve the real file from public folder
            const link = document.createElement('a');
            link.href = `/${client.file}`;
            link.download = client.file;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        // Simulate file download
        const dummyContent = `Mock Installer for ${client.os}\nVersion: ${client.version}\n\nThis is a simulation of the installer binary.`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = client.file || 'installer.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Download Clients</h1>
                <p className="text-gray-400">Install the VPN client on your persistent devices to join the mesh network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client, index) => (
                    <motion.div
                        key={client.os}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <client.icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{client.os}</h3>
                        <p className="text-sm text-cyan-400 font-mono mb-2">{client.version}</p>
                        <p className="text-sm text-gray-500 mb-6">{client.description}</p>
                        <button
                            onClick={() => handleDownload(client)}
                            className="w-full py-2 bg-white/10 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-black transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
