"use client";

import React from "react";

interface SleekLoaderProps {
  message?: string;
}

export function SleekLoader({ message }: SleekLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-10">
        {/* Animated connecting nodes */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Center node */}
          <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/40"></div>

          {/* 4 peripheral nodes */}
          {[0, 90, 180, 270].map((angle, i) => (
            <React.Fragment key={i}>
              {/* Nodes */}
              <div
                className="absolute w-3 h-3 rounded-full bg-cyan-400/60"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-55px)`,
                }}
              ></div>

              {/* Connecting lines with flow animation */}
              <div
                className="absolute h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"
                style={{
                  width: "55px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "left center",
                  transform: `translate(0, -50%) rotate(${angle}deg)`,
                  animation: `flowLine 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              ></div>
            </React.Fragment>
          ))}

          {/* Pulsing rings */}
          {[1, 2].map(ring => (
            <div
              key={`ring-${ring}`}
              className="absolute rounded-full border border-cyan-400/40"
              style={{
                width: `${ring * 70}px`,
                height: `${ring * 70}px`,
                animation: `pulse ${2}s ease-out infinite`,
                animationDelay: `${ring * 0.3}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated progress bar simulating data transfer */}
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden border border-cyan-400/30">
          <div
            className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              animation: "loadingBar 1.5s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-light tracking-widest text-cyan-300">
            ZENITH AI
          </h2>
          {message && (
            <p className="text-xs text-slate-400 text-center">{message}</p>
          )}
          <p className="text-xs text-slate-500">Analyzing your data</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes flowLine {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
