'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05030b] relative overflow-hidden text-white flex flex-col">
      {/* Plasma background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="plasma-bg absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:80px_80px,80px_80px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <Image
            src="/nymlogotrs.png"
            alt="nym logo"
            width={40}
            height={40}
            className="rounded-full border border-white/20 object-contain"
            priority
          />
          <h1 className="text-2xl font-bold text-white">nym</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link
            href="/builder"
            className="px-5 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition shadow-lg shadow-primary/40"
          >
            Launch App
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight">nym</h2>

          <div className="flex flex-col sm:flex-row items-center justify-center text-4xl sm:text-5xl font-semibold space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
            <span className="text-gray-100">Build on</span>
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

      </main>

      <footer className="relative z-10 text-center text-sm text-gray-400 py-6">
        <p>© 2025 nym.fun · ask@nym.fun</p>
      </footer>

      <style jsx global>{`
        .plasma-bg {
          background: radial-gradient(circle at 20% 20%, rgba(110, 84, 255, 0.4), transparent 45%),
            radial-gradient(circle at 80% 30%, rgba(177, 129, 255, 0.5), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(86, 64, 255, 0.35), transparent 45%);
          filter: blur(120px);
          animation: plasma-shift 12s ease-in-out infinite;
        }
        @keyframes plasma-shift {
          0% {
            transform: scale(1) translateY(0px);
          }
          50% {
            transform: scale(1.2) translateY(-20px);
          }
          100% {
            transform: scale(1) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
