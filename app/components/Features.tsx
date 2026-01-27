'use client';

import { motion } from 'framer-motion';
import { Lock, Wifi, Smartphone, Globe2, ShieldCheck, Cpu } from 'lucide-react';

const features = [
    {
        icon: Lock,
        title: "No-Log Policy",
        description: "We never track, collect, or share your private data. Your online activity is your business alone."
    },
    {
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        description: "Your data is protected by AES-256 encryption, the same standard used by security experts worldwide."
    },
    {
        icon: Wifi,
        title: "High-Speed Connection",
        description: "Enjoy buffer-free streaming and lag-free gaming with our ultra-fast 10Gbps server network."
    },
    {
        icon: Globe2,
        title: "Global Access",
        description: "Bypass geo-restrictions and access your favorite content from anywhere in the world."
    },
    {
        icon: Smartphone,
        title: "Multi-Device Support",
        description: "Protect all your devices with one account. Available on iOS, Android, Windows, and macOS."
    },
    {
        icon: Cpu,
        title: "Kill Switch",
        description: "Automatic internet cut-off if your VPN connection drops, ensuring your data never leaks."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-cyan-400 font-medium tracking-wide text-sm uppercase mb-3">Why Choose Us</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Features that protect you</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We've built a VPN that balances iron-clad security with blazing fast performance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors">
                                <feature.icon className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
