// BACKUP — Original Screen 1 (Welcome) from Onboarding.jsx
// Saved before onboarding rebuild

import { useState, useRef } from 'react';

// ── Custom flame + book SVG icon (from mockup) ───────────────
function FlameIcon({ size = 64 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 64 90" fill="none">
      <defs>
        <radialGradient id="fg" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c45510" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fl" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fff6b0" />
          <stop offset="100%" stopColor="#ffab20" />
        </linearGradient>
        <linearGradient id="pl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="100%" stopColor="#f5d060" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="pr" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="100%" stopColor="#f5d060" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="sp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe799" />
          <stop offset="100%" stopColor="#b07010" />
        </linearGradient>
        <filter id="fw">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feFlood floodColor="#ffcc44" floodOpacity="0.8" result="c" />
          <feComposite in="c" in2="b" operator="in" result="s" />
          <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="32" cy="62" rx="28" ry="20" fill="url(#fg)" />
      {/* Left page */}
      <path d="M32 58 C29 57 23 55 16 53 C10 51.5 5 51 3 51.2 C1.8 51.3 1.5 52 1.7 52.9 C1.9 53.9 3.5 54.8 6 55.6 C10 57 16.5 57.8 22 58 C24.5 58.1 27 57.6 32 56.5Z" fill="url(#pl)" />
      {/* Right page */}
      <path d="M32 58 C35 57 41 55 48 53 C54 51.5 59 51 61 51.2 C62.2 51.3 62.5 52 62.3 52.9 C62.1 53.9 60.5 54.8 58 55.6 C54 57 47.5 57.8 42 58 C39.5 58.1 37 57.6 32 56.5Z" fill="url(#pr)" />
      {/* Cover */}
      <path d="M7 55 Q32 60 57 55 L57 57.5 Q32 63 7 57.5Z" fill="url(#sp)" opacity="0.7" />
      {/* Spine */}
      <rect x="30" y="56" width="4" height="14" rx="2" fill="url(#sp)" />
      {/* Flame */}
      <g filter="url(#fw)">
        <path d="M32 8 C32 8 42 21 42.3 30 C42.6 37 39 41 36.5 43.5 C39.5 38.5 39.7 31.5 36.5 26 C38.2 32 37.6 37 32 40.5 C26.4 37 25.8 32 27.5 26 C24.3 31.5 24.5 38.5 27.5 43.5 C25 41 21.4 37 21.7 30 C22 21 32 8 32 8Z" fill="url(#fl)" opacity="0.97" />
        <ellipse cx="32" cy="14" rx="4" ry="7" fill="white" opacity="0.88" />
      </g>
    </svg>
  );
}

export default function Screen1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 32px', textAlign: 'center' }}>
      {/* Large icon */}
      <div style={{
        width: 120, height: 120, borderRadius: 28,
        background: 'radial-gradient(circle at 40% 35%, #c45510, #8c2e00 55%, #4a1200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 60px rgba(196,85,16,0.6), 0 8px 32px rgba(0,0,0,0.5)',
        marginBottom: 32,
      }}>
        <FlameIcon size={56} />
      </div>

      <p style={{ fontSize: 10, letterSpacing: 5, color: '#c9820a', marginBottom: 12, fontFamily: 'Georgia, serif' }}>MY PRAYER APP</p>

      <h1 style={{
        fontSize: 42, fontWeight: 700, lineHeight: 1.15,
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(180deg, #fff2a0 0%, #f5c030 40%, #c07010 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 20,
      }}>A Quiet Place{'\n'}to Pray</h1>

      <p style={{
        fontSize: 16, lineHeight: 1.65, color: '#d4a878',
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        maxWidth: 280,
      }}>
        Reflect. Record. Return.<br />
        Watch what God does in your life.
      </p>

      {/* Scripture */}
      <div style={{
        marginTop: 36, padding: '14px 20px',
        border: '1px solid rgba(201,130,10,0.25)',
        borderRadius: 12, maxWidth: 290,
        background: 'rgba(201,130,10,0.06)',
      }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: '#c9a050', fontFamily: 'Georgia, serif', lineHeight: 1.6, margin: 0 }}>
          "Call to me and I will answer you."
        </p>
        <p style={{ fontSize: 10, color: '#8a6030', fontFamily: 'Georgia, serif', margin: '6px 0 0' }}>— Jeremiah 33:3</p>
      </div>
    </div>
  );
}
