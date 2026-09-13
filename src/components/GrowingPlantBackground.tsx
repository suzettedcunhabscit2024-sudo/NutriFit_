import React, { useEffect, useState, useRef } from 'react';

/**
 * 3D Scroll-Reactive Botanical Plant Background
 * - Centered horizontally at the bottom of the viewport
 * - Completely open-ended at the base (no pot or container)
 * - Morphs dynamically from a small, tender sprout into a full lush plant with leaves & fruits as you scroll down
 * - Gracefully shrinks back down as you scroll up
 */
export const GrowingPlantBackground: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      targetProgress.current = progress;
    };

    // Smooth lerp loop for silky organic growth and contraction
    const updateMotion = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.08;
      setScrollProgress(currentProgress.current);
      animFrameId.current = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animFrameId.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const p = scrollProgress; // 0 (top of page) to 1 (bottom of page)

  // Dynamic growth calculations
  // Overall scale: 0.32 (small young sprout) to 1.0 (grand flourishing plant)
  const plantScale = 0.32 + p * 0.68;
  // Main trunk vertical elongation
  const trunkGrowth = Math.min(1, p * 1.35);
  // Tiered branching as scroll deepens
  const branchLeftGrowth = Math.max(0, Math.min(1, (p - 0.12) / 0.32));
  const branchRightGrowth = Math.max(0, Math.min(1, (p - 0.22) / 0.34));
  const canopyGrowth = Math.max(0, Math.min(1, (p - 0.38) / 0.38));
  // Foliage leaf lushness
  const foliageScale = Math.max(0.1, Math.min(1, p * 1.25));
  // 3D Fruit development: buds begin at ~32%, fully plump ripe fruits at 70%+
  const fruitScale = Math.max(0, Math.min(1, (p - 0.32) / 0.45));
  const fruitOpacity = Math.max(0, Math.min(1, (p - 0.28) / 0.2));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Very Light Matte Green Base Atmosphere */}
      <div className="absolute inset-0 bg-[#edf4ec] transition-colors duration-700" />

      {/* Ambient Matte Green Radial Lights */}
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background: `
            radial-gradient(circle at 50% 100%, rgba(167, 215, 170, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 15% 20%, rgba(195, 230, 198, 0.35) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(185, 225, 188, 0.35) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(244, 249, 243, 0.6) 0%, transparent 70%)
          `
        }}
      />

      {/* Floating ambient botanical spores in background */}
      <div
        className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/25 blur-xs transition-transform"
        style={{
          top: `${45 - p * 25}%`,
          left: `${20 + p * 8}%`,
          transform: `scale(${0.5 + p * 0.8}) rotate(${p * 200}deg)`
        }}
      />
      <div
        className="absolute w-4 h-2 rounded-full bg-lime-500/20 blur-xs transition-transform"
        style={{
          top: `${55 - p * 30}%`,
          right: `${22 + p * 6}%`,
          transform: `scale(${0.6 + p * 0.6}) rotate(${45 + p * 180}deg)`
        }}
      />
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500/20 blur-xs transition-transform"
        style={{
          top: `${20 - p * 10}%`,
          left: `${48 - p * 5}%`,
          transform: `scale(${0.4 + p * 0.9})`
        }}
      />

      {/* 2. Primary Centered 3D Growing Plant (Open-Ended Base, Centered Horizontally) */}
      <div
        className="absolute bottom-0 left-1/2 origin-bottom transition-transform ease-out duration-75 opacity-70 sm:opacity-85"
        style={{
          width: 'min(92vw, 680px)',
          height: 'min(88vh, 650px)',
          transform: `translateX(-50%) scale(${plantScale}) translateY(${(1 - plantScale) * 20}px)`,
          filter: 'drop-shadow(0 20px 30px rgba(22, 65, 30, 0.09))'
        }}
      >
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Trunk & Branch 3D Cylindrical Gradients */}
            <linearGradient id="centerTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#226428" />
              <stop offset="30%" stopColor="#3d9143" />
              <stop offset="65%" stopColor="#5bb360" />
              <stop offset="100%" stopColor="#1b5321" />
            </linearGradient>

            <linearGradient id="woodBranchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e5824" />
              <stop offset="55%" stopColor="#328537" />
              <stop offset="100%" stopColor="#4caf50" />
            </linearGradient>

            {/* Open-Ended Root Soft Fades */}
            <linearGradient id="rootFadeLeft" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#43a047" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#66bb6a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rootFadeRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#43a047" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#66bb6a" stopOpacity="0.0" />
            </linearGradient>

            {/* Leaf 3D Shading Gradients */}
            <linearGradient id="leafGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#81c784" />
              <stop offset="45%" stopColor="#43a047" />
              <stop offset="100%" stopColor="#1b5e20" />
            </linearGradient>

            <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5d6a7" />
              <stop offset="40%" stopColor="#66bb6a" />
              <stop offset="100%" stopColor="#2e7d32" />
            </linearGradient>

            <linearGradient id="leafGradVibrant" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c8e6c9" />
              <stop offset="45%" stopColor="#81c784" />
              <stop offset="100%" stopColor="#388e3c" />
            </linearGradient>

            {/* 3D Ripe Spherical Fruit Gradients */}
            <radialGradient id="appleRed3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff8a80" />
              <stop offset="25%" stopColor="#ef5350" />
              <stop offset="70%" stopColor="#c62828" />
              <stop offset="100%" stopColor="#8e0000" />
            </radialGradient>

            <radialGradient id="appleGreen3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ccff90" />
              <stop offset="30%" stopColor="#76ff03" />
              <stop offset="75%" stopColor="#43a047" />
              <stop offset="100%" stopColor="#1b5e20" />
            </radialGradient>

            <radialGradient id="orangeFruit3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffe082" />
              <stop offset="30%" stopColor="#ffa726" />
              <stop offset="80%" stopColor="#f57c00" />
              <stop offset="100%" stopColor="#e65100" />
            </radialGradient>

            {/* 3D Filters */}
            <filter id="shadow3D" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.22" floodColor="#0f3813" />
            </filter>
            <filter id="fruitShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="3" dy="6" stdDeviation="4" floodOpacity="0.28" floodColor="#1a0000" />
            </filter>
          </defs>

          {/* --- OPEN-ENDED ROOT BASE (No pot, seamlessly blends into bottom border) --- */}
          <g id="open-ended-base">
            {/* Soft ground mist shadow at baseline */}
            <ellipse cx="250" cy="596" rx={100 + p * 60} ry="10" fill="rgba(34, 100, 40, 0.09)" />

            {/* Open-ended root tendrils diverging softly outwards into the screen edge */}
            {/* Primary Left Root */}
            <path
              d="M 250 595 Q 210 598 150 600"
              fill="none"
              stroke="url(#rootFadeLeft)"
              strokeWidth={7 + p * 3}
              strokeLinecap="round"
            />
            {/* Secondary Lower Left Root */}
            <path
              d="M 245 595 Q 185 592 105 600"
              fill="none"
              stroke="url(#rootFadeLeft)"
              strokeWidth={4.5 + p * 2}
              strokeLinecap="round"
            />
            {/* Primary Right Root */}
            <path
              d="M 250 595 Q 290 598 350 600"
              fill="none"
              stroke="url(#rootFadeRight)"
              strokeWidth={7 + p * 3}
              strokeLinecap="round"
            />
            {/* Secondary Lower Right Root */}
            <path
              d="M 255 595 Q 315 592 395 600"
              fill="none"
              stroke="url(#rootFadeRight)"
              strokeWidth={4.5 + p * 2}
              strokeLinecap="round"
            />

            {/* Central Root Anchor merging into base */}
            <path
              d="M 238 600 Q 250 592 262 600 Z"
              fill="#2e7d32"
              opacity="0.8"
            />
          </g>

          {/* --- MAIN CENTER TRUNK (Grows organically upward) --- */}
          <path
            d={`M 250 595 Q ${246 - p * 25} ${460 - p * 60} ${252 + p * 15} ${
              595 - trunkGrowth * 310
            }`}
            fill="none"
            stroke="url(#centerTrunkGrad)"
            strokeWidth={11 + p * 7}
            strokeLinecap="round"
            filter="url(#shadow3D)"
          />

          {/* Upper Trunk Extension as scroll advances */}
          {p > 0.18 && (
            <path
              d={`M ${252 + p * 15} ${595 - trunkGrowth * 310} Q ${255 + p * 25} ${
                400 - p * 120
              } ${245 + p * 15} ${270 - p * 80}`}
              fill="none"
              stroke="url(#woodBranchGrad)"
              strokeWidth={8 + p * 3}
              strokeLinecap="round"
              filter="url(#shadow3D)"
            />
          )}

          {/* --- BRANCH 1: Symmetrical Left Branch (Unfurls when scroll > 12%) --- */}
          <g
            id="branch-left"
            transform={`translate(${245}, ${485 - p * 35}) scale(${branchLeftGrowth})`}
            style={{ transformOrigin: '0 0' }}
          >
            <path
              d="M 0 0 C -45 -15, -85 -15, -115 15"
              fill="none"
              stroke="url(#woodBranchGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Cluster of Leaves on Left Branch */}
            <path
              d="M -70 -12 C -95 -45, -135 -35, -125 -5 C -115 18, -85 5, -70 -12 Z"
              fill="url(#leafGradPrimary)"
              filter="url(#shadow3D)"
              transform={`scale(${foliageScale})`}
            />
            <path
              d="M -115 15 C -145 20, -165 55, -130 60 C -100 60, -105 32, -115 15 Z"
              fill="url(#leafGradLight)"
              filter="url(#shadow3D)"
              transform={`scale(${foliageScale})`}
            />

            {/* Apple Fruit 1 on Left Branch (Red Crisp Apple) */}
            <g
              style={{
                transform: `translate(-105px, 35px) scale(${fruitScale})`,
                opacity: fruitOpacity,
                transformOrigin: 'center'
              }}
            >
              <path d="M 0 -18 Q 4 -26 10 -28" fill="none" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 4 -24 Q 12 -28 14 -22 Q 10 -18 4 -24 Z" fill="#66bb6a" />
              <ellipse cx="0" cy="0" rx="19" ry="18" fill="url(#appleRed3D)" filter="url(#fruitShadow)" />
              <ellipse cx="-1" cy="4" rx="16" ry="15" fill="url(#appleRed3D)" />
              {/* Specular 3D Reflection */}
              <ellipse cx="-6" cy="-6" rx="5" ry="2.8" fill="white" opacity="0.7" transform="rotate(-30 -6 -6)" />
            </g>
          </g>

          {/* --- BRANCH 2: Symmetrical Right Branch (Unfurls when scroll > 22%) --- */}
          <g
            id="branch-right"
            transform={`translate(${255}, ${450 - p * 40}) scale(${branchRightGrowth})`}
            style={{ transformOrigin: '0 0' }}
          >
            <path
              d="M 0 0 C 45 -20, 90 -15, 120 20"
              fill="none"
              stroke="url(#woodBranchGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Cluster of Leaves on Right Branch */}
            <path
              d="M 70 -14 C 95 -45, 140 -35, 130 5 C 115 25, 85 10, 70 -14 Z"
              fill="url(#leafGradVibrant)"
              filter="url(#shadow3D)"
              transform={`scale(${foliageScale})`}
            />
            <path
              d="M 120 20 C 150 25, 170 60, 135 65 C 105 65, 105 38, 120 20 Z"
              fill="url(#leafGradLight)"
              filter="url(#shadow3D)"
              transform={`scale(${foliageScale})`}
            />

            {/* Apple Fruit 2 on Right Branch (Fresh Green Apple) */}
            <g
              style={{
                transform: `translate(110px, 40px) scale(${fruitScale * 0.96})`,
                opacity: fruitOpacity,
                transformOrigin: 'center'
              }}
            >
              <path d="M 0 -16 Q -4 -24 -8 -26" fill="none" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="17" ry="16.5" fill="url(#appleGreen3D)" filter="url(#fruitShadow)" />
              <ellipse cx="-5" cy="-5" rx="4" ry="2.4" fill="white" opacity="0.75" transform="rotate(-35 -5 -5)" />
            </g>
          </g>

          {/* --- BRANCH 3: Canopy Spread (Unfurls when scroll > 38%) --- */}
          <g
            id="branch-canopy"
            transform={`translate(${250 + p * 15}, ${310 - p * 60}) scale(${canopyGrowth})`}
            style={{ transformOrigin: '0 0' }}
          >
            {/* Upper Left Canopy Fork */}
            <path
              d="M 0 0 C -35 -35, -70 -50, -95 -25"
              fill="none"
              stroke="url(#centerTrunkGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M -85 -35 C -105 -65, -145 -45, -125 -20 C -105 5, -75 -15, -85 -35 Z"
              fill="url(#leafGradPrimary)"
              filter="url(#shadow3D)"
            />

            {/* Upper Right Canopy Fork */}
            <path
              d="M 0 0 C 40 -35, 80 -45, 100 -20"
              fill="none"
              stroke="url(#centerTrunkGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 85 -30 C 115 -58, 145 -30, 125 -5 C 105 15, 75 -10, 85 -30 Z"
              fill="url(#leafGradLight)"
              filter="url(#shadow3D)"
            />

            {/* Top Citrus / Golden Pear Fruit */}
            <g
              style={{
                transform: `translate(-45px, -15px) scale(${fruitScale * 1.05})`,
                opacity: fruitOpacity,
                transformOrigin: 'center'
              }}
            >
              <path d="M 0 -16 Q 2 -23 7 -25" fill="none" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="18" ry="17" fill="url(#orangeFruit3D)" filter="url(#fruitShadow)" />
              <ellipse cx="-5" cy="-5" rx="4.5" ry="2.5" fill="white" opacity="0.7" transform="rotate(-30 -5 -5)" />
            </g>

            {/* Additional Upper Right Harvest Apple */}
            <g
              style={{
                transform: `translate(75px, -10px) scale(${fruitScale * 0.92})`,
                opacity: fruitOpacity,
                transformOrigin: 'center'
              }}
            >
              <path d="M 0 -15 Q -3 -22 -6 -24" fill="none" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="16" ry="15.5" fill="url(#appleRed3D)" filter="url(#fruitShadow)" />
              <ellipse cx="-4" cy="-5" rx="4" ry="2.2" fill="white" opacity="0.7" transform="rotate(-30 -4 -5)" />
            </g>
          </g>

          {/* --- TOP SPROUT CROWN (Always present, elevates dynamically with growth) --- */}
          <g
            id="top-sprout-crown"
            transform={`translate(${250 + p * 15}, ${585 - trunkGrowth * 360})`}
          >
            {/* Left Sprout Leaf */}
            <path
              d="M 0 0 C -30 -25, -60 -20, -55 10 C -50 35, -12 18, 0 0 Z"
              fill="url(#leafGradVibrant)"
              filter="url(#shadow3D)"
              transform={`scale(${0.85 + p * 0.55}) rotate(${-18 - p * 12})`}
            />
            <path
              d="M 0 0 C -18 -6, -35 -3, -48 10"
              fill="none"
              stroke="#a5d6a7"
              strokeWidth="1.2"
              opacity="0.8"
              transform={`scale(${0.85 + p * 0.55}) rotate(${-18 - p * 12})`}
            />

            {/* Right Sprout Leaf */}
            <path
              d="M 0 0 C 30 -30, 65 -25, 60 10 C 55 35, 18 18, 0 0 Z"
              fill="url(#leafGradLight)"
              filter="url(#shadow3D)"
              transform={`scale(${0.85 + p * 0.55}) rotate(${22 + p * 12})`}
            />
            <path
              d="M 0 0 C 18 -10, 38 -7, 52 8"
              fill="none"
              stroke="#c8e6c9"
              strokeWidth="1.2"
              opacity="0.8"
              transform={`scale(${0.85 + p * 0.55}) rotate(${22 + p * 12})`}
            />

            {/* Center Tender Leaf Bud / Golden Blossom */}
            <g transform={`scale(${0.6 + p * 0.85})`}>
              <ellipse cx="0" cy="-12" rx="9" ry="16" fill="url(#leafGradVibrant)" />
              {p > 0.35 && (
                <circle cx="0" cy="-22" r={3.5 + p * 3.5} fill="#fff59d" filter="url(#shadow3D)" />
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Subtle Minimal Vitality Indicator (Discreet bottom-left badge) */}
      <div className="hidden lg:flex absolute bottom-3 left-4 items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-emerald-200/60 shadow-xs text-[11px] font-semibold text-emerald-900/80">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          {p < 0.2
            ? 'Sprout Stage • Scroll to Grow'
            : p < 0.6
            ? 'Vitality Bloom & Foliage'
            : 'Full Harvest & Nutrition'}
        </span>
      </div>
    </div>
  );
};
