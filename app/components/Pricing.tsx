'use client';

import { Check } from 'lucide-react';

const plans = [
    {
        name: "Monthly",
        price: "$12.95",
        period: "/mo",
        features: ["5 Devices", "All Server Locations", "High Speed", "24/7 Support"],
        popular: false
    },
    {
        name: "Yearly",
        price: "$6.67",
        period: "/mo",
        billed: "$80.00 billed yearly",
        features: ["Unlimited Devices", "Dedicated IP", "Ad Blocker", "Priority Support"],
        popular: true
    },
    {
        name: "2 Years",
        price: "$3.99",
        period: "/mo",
        billed: "$95.76 billed every 2 years",
        features: ["Unlimited Devices", "Dedicated IP +", "Malware Protection", "VIP Support"],
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 -skew-y-3 z-0 transform origin-left scale-150" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400">Choose the plan that's right for you. All plans include a 30-day money-back guarantee.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-3xl border ${plan.popular
                                    ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-105 z-10'
                                    : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                                } transition-all duration-300`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-medium text-gray-300 mb-4">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>
                            <div className="text-sm text-gray-500 h-6 mb-8">{plan.billed || "Billed monthly"}</div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-cyan-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular
                                    ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/25'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}>
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
