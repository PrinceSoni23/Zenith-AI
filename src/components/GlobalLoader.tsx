"use client";

import React from "react";

interface LoaderProps {
  message?: string;
}

export function Loader({ message }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"></div>
      </div>

      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* Animated AI signal waves */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Center brain/AI core */}
          <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"></div>

          {/* Pulsing waves */}
          {[1, 2, 3].map(ring => (
            <div
              key={ring}
              className="absolute rounded-full border border-cyan-400/60"
              style={{
                width: `${ring * 40}px`,
                height: `${ring * 40}px`,
                animation: `radar ${2 + ring * 0.3}s ease-out infinite`,
                opacity: 1 - ring * 0.2,
              }}
            ></div>
          ))}

          {/* Energy particles orbiting */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300"
              style={{
                left: "50%",
                top: "50%",
                animation: `orbitAI ${3}s linear infinite`,
                animationDelay: `${(i / 6) * 3}s`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "48px",
                  height: "0",
                  left: "0",
                  top: "-48px",
                  background: "inherit",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Data stream lines flowing down */}
        <div className="flex gap-6 items-end h-16">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-b from-cyan-400 via-blue-400 to-transparent rounded-full"
              style={{
                height: `${20 + i * 8}px`,
                animation: `stream ${1.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-light tracking-widest text-cyan-300">
            ZENITH AI
          </h2>
          {message && (
            <p className="text-xs text-slate-400 text-center">{message}</p>
          )}
          <p className="text-xs text-slate-500">Processing your request</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes radar {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes orbitAI {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-48px)
              rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateY(-48px)
              rotate(-360deg);
          }
        }

        @keyframes stream {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scaleY(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
