import React from 'react';

interface TacticalBackgroundProps {
  className?: string;
}

export const TacticalBackground: React.FC<TacticalBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 no-print ${className}`}
    >
      {/* Base Deep Tactical Charcoal / Black Background */}
      <div className="absolute inset-0 bg-[#05070a]" />

      {/* Cyber Tactical Grid Overlay (Infinite Crisp Vector Pattern) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Small 36px Tactical Grid */}
          <pattern
            id="tactical-small-grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.8"
              strokeOpacity="0.09"
            />
          </pattern>

          {/* Large 144px Master Grid with Intersect Crosshairs */}
          <pattern
            id="tactical-major-grid"
            width="144"
            height="144"
            patternUnits="userSpaceOnUse"
          >
            <rect width="144" height="144" fill="url(#tactical-small-grid)" />
            {/* Major grid borders */}
            <path
              d="M 144 0 L 0 0 0 144"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.22"
            />
            {/* Crosshair at intersection */}
            <path
              d="M 0 6 L 0 -6 M -6 0 L 6 0"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <path
              d="M 144 6 L 144 -6 M 138 0 L 150 0"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <circle cx="0" cy="0" r="1.5" fill="#34d399" fillOpacity="0.5" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#tactical-major-grid)" />
      </svg>

      {/* Tactical Ambient Radial Illumination (Cyber Center Glow) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 75%)',
        }}
      />

      {/* Deep Vignette Edge Falloff */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 35%, rgba(5, 7, 10, 0.7) 75%, #05070a 100%)',
        }}
      />

      {/* Rotating Clockwise Logo & Concentric Holographic HUD Centerpiece */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Glow Halo behind the logo */}
        <div className="absolute w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-emerald-500/10 blur-3xl" />

        {/* Outer Counter-Rotating Segmented Tech Ring */}
        <div className="absolute w-[560px] h-[560px] sm:w-[740px] sm:h-[740px] rounded-full border border-emerald-500/15 border-dashed animate-spin-counter" />

        {/* Mid Concentric Tactical HUD Ring with Accent Notches */}
        <div className="absolute w-[490px] h-[490px] sm:w-[650px] sm:h-[650px] rounded-full border border-cyan-500/15">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-emerald-400/40 rounded-full" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-emerald-400/40 rounded-full" />
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-cyan-400/40 rounded-full" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-cyan-400/40 rounded-full" />
        </div>

        {/* The Clockwise Rotating Logo Container */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[580px] md:h-[580px] animate-spin-clockwise">
          {/* Subtle Outer Glowing Edge on Logo Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/25 shadow-[0_0_40px_rgba(6,182,212,0.2)]" />
          
          {/* Actual Ignite Sports Club Dragon Logo */}
          <img
            src="/ignite-logo.png"
            alt=""
            className="w-full h-full object-cover rounded-full opacity-20 sm:opacity-25 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]"
          />
        </div>
      </div>

      {/* Screen Corner Tactical Angle Brackets (L Brackets) */}
      {/* Top Left */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-emerald-500/40 pointer-events-none">
        <span className="absolute -top-3.5 -left-1 text-[9px] font-mono font-bold tracking-widest text-emerald-400/50">
          SYS//01
        </span>
      </div>

      {/* Top Right */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-emerald-500/40 pointer-events-none">
        <span className="absolute -top-3.5 -right-1 text-[9px] font-mono font-bold tracking-widest text-emerald-400/50">
          SEC//IGNITE
        </span>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-emerald-500/40 pointer-events-none">
        <span className="absolute -bottom-3.5 -left-1 text-[9px] font-mono font-bold tracking-widest text-emerald-400/50">
          EST.2025
        </span>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-emerald-500/40 pointer-events-none">
        <span className="absolute -bottom-3.5 -right-1 text-[9px] font-mono font-bold tracking-widest text-emerald-400/50">
          HUD//READY
        </span>
      </div>
    </div>
  );
};
