'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05030b] relative overflow-hidden text-white">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,84,255,0.25),_transparent_50%),linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:100%_100%,80px_80px,80px_80px] opacity-90 pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <Image
            src="/nymlogotrs.png"
            alt="nym logo"
            width={40}
            height={40}
            className="rounded-full border border-white/20 object-contain"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Monad Web3 Builder</p>
            <h1 className="text-2xl font-bold text-white">nym</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/builder" className="text-gray-300 hover:text-white transition">Builder</Link>
          <Link href="/builder" className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition">
            Launch App
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.5em] text-gray-400 text-xs mb-4">AI POWERED · MONAD READY</p>

          <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">nym</h2>

          <div className="flex flex-col sm:flex-row items-center justify-center text-4xl sm:text-5xl font-semibold space-y-4 sm:space-y-0 sm:space-x-4">
            <span className="text-gray-200">Build on</span>
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-sm shadow-lg shadow-primary/20">
              <span className="text-white text-2xl">"</span>
              <Image
                src="/middleimage.png"
                alt="middle logo"
                width={92}
                height={92}
                className="object-contain drop-shadow-[0_0_25px_rgba(110,84,255,0.6)]"
                priority
              />
              <span className="text-white text-2xl">"</span>
            </div>
            <span className="text-gray-200">, now.</span>
          </div>

          <p className="text-lg text-gray-300 mt-8 max-w-3xl mx-auto">
            Instantly design, code, preview, and deploy Monad-native apps. AI-driven builder, live editor, dual agents. One
            command away from production.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/builder"
              className="px-10 py-3 rounded-full bg-primary text-white text-lg font-semibold tracking-wide hover:bg-primary/80 transition shadow-xl shadow-primary/30 ring-2 ring-primary/60"
            >
              Start building
            </Link>
            <Link
              href="https://x.com/nymdotfun"
              target="_blank"
              className="px-8 py-3 rounded-full bg-white/10 text-white text-lg font-medium hover:bg-white/20 transition border border-white/20"
            >
              @nymdotfun
            </Link>
            <Link
              href="/builder"
              className="px-8 py-3 rounded-full bg-white/5 text-white text-lg font-medium hover:bg-white/10 transition border border-white/10"
            >
              $NYM
            </Link>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full">
          {[
            {
              title: 'Live Code + Preview',
              text: 'AI-generated React code instantly renders inside the Monad preview sandbox.',
            },
            {
              title: 'Dual Agent Workflow',
              text: 'Builder agent crafts code while Planner agent guides feature decisions in context.',
            },
            {
              title: 'Ready to Deploy',
              text: 'Export ZIPs, manage workspaces, and ship to Monad Mainnet via Railway-ready backend.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:border-primary/40 transition"
            >
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </main>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-72 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-[50%] blur-3xl opacity-70 pointer-events-none" />
    </div>
  );
}
