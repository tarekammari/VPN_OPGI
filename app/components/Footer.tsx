export default function Footer() {
    return (
        <footer className="bg-slate-950 py-12 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400">Features</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Security</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Servers</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Download</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Careers</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Blog</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400">Help Center</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Setup Guides</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Troubleshooting</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Report Abuse</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-cyan-400">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} OPGI VPN. All rights reserved.</p>
                        <span className="hidden md:inline text-white/10">•</span>
                        <p>v{process.env.APP_VERSION}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Social icons would go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
