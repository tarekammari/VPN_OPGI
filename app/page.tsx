import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
            <Hero />
            <Features />
            <Pricing />
        </main>
    );
}
