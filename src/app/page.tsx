import React from "react";
import ThreeJSFooter from "./components/ThreeJSFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0e0d] via-[#0f1716] to-[#0a0e0d] text-[#00ff88]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#2EE59D] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${
                5 + Math.random() * 10
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated CSS */}
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(46, 229, 157, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(46, 229, 157, 0.6); }
                }
                @keyframes fade-in-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out;
                }
            `}</style>
      <div className="text-center max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-linear-to-r from-[#00ff88] via-[#00ffaa] to-[#00cc77] bg-clip-text text-transparent mb-4 neon-text">
            Welcome to Co-Verse
          </h1>
          <p className="text-xl text-[#00ff88]/70 mb-8">
            Real-time collaborative workspace for modern teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f1716]/60 backdrop-blur-xl border border-[#00ff88]/30 rounded-2xl p-6 hover:border-[#00ff88]/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc77] rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#00ff88] mb-2">
              Kanban Board
            </h3>
            <p className="text-sm text-[#00ff88]/60">
              Visualize and manage tasks with drag-and-drop simplicity
            </p>
          </div>

          <div className="bg-[#0f1716]/60 backdrop-blur-xl border border-[#00ff88]/30 rounded-2xl p-6 hover:border-[#00ff88]/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc77] rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#00ff88] mb-2">
              Live Documents
            </h3>
            <p className="text-sm text-[#00ff88]/60">
              Collaborate on documents in real-time with your team
            </p>
          </div>

          <div className="bg-[#0f1716]/60 backdrop-blur-xl border border-[#00ff88]/30 rounded-2xl p-6 hover:border-[#00ff88]/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc77] rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#00ff88] mb-2">
              Activity Feed
            </h3>
            <p className="text-sm text-[#00ff88]/60">
              Stay updated with real-time project activity
            </p>
          </div>
        </div>

        <p className="text-[#00ff88]/50 text-sm">
          Select a project from the sidebar to get started
        </p>
      </div>
    </div>
  );
}
