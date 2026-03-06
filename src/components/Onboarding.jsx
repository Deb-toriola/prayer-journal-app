import { useState } from 'react';
import prayingHandsImg from '../assets/praying-hands.jpg';

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

// ── Screen 1: Welcome ─────────────────────────────────────────
function Screen1() {
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

// ── Screen 2: Features ────────────────────────────────────────
function Screen2() {
  const features = [
    { icon: '📖', label: 'Journal your prayers', sub: 'Write by category. Add scripture. Build a record of your prayer life.' },
    { icon: '🔥', label: 'Build your streak', sub: 'Track every day you show up — whether logged in or as a guest.' },
    { icon: '✨', label: 'Record testimonies', sub: 'When God comes through, log it. Read how far He\'s brought you.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '40px 32px' }}>
      <p style={{ fontSize: 10, letterSpacing: 5, color: '#c9820a', marginBottom: 10, fontFamily: 'Georgia, serif', textAlign: 'center' }}>WHAT YOU CAN DO</p>
      <h2 style={{
        fontSize: 36, fontWeight: 700, lineHeight: 1.2, textAlign: 'center',
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(180deg, #fff2a0 0%, #f5c030 40%, #c07010 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 32,
      }}>Pray with purpose.</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            padding: '16px 18px',
            background: 'rgba(201,130,10,0.07)',
            border: '1px solid rgba(201,130,10,0.2)',
            borderRadius: 14,
          }}>
            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f5d080', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>{f.label}</p>
              <p style={{ fontSize: 12.5, color: '#a07840', lineHeight: 1.55, fontFamily: 'Georgia, serif', margin: 0 }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: CTA ─────────────────────────────────────────────
function Screen3({ onSignUp, onGuest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 32px', textAlign: 'center' }}>
      <img
        src={prayingHandsImg}
        alt="praying hands"
        style={{
          width: 110, height: 110,
          objectFit: 'cover', objectPosition: '50% 28%',
          borderRadius: 16,
          mixBlendMode: 'screen',
          marginBottom: 24,
        }}
      />

      <p style={{ fontSize: 10, letterSpacing: 5, color: '#c9820a', marginBottom: 10, fontFamily: 'Georgia, serif' }}>GET STARTED</p>

      <h2 style={{
        fontSize: 36, fontWeight: 700, lineHeight: 1.2,
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(180deg, #fff2a0 0%, #f5c030 40%, #c07010 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 16,
      }}>Your prayers{'\n'}are waiting.</h2>

      <p style={{ fontSize: 14, lineHeight: 1.65, color: '#a07840', fontFamily: 'Georgia, serif', maxWidth: 280, marginBottom: 36 }}>
        Create a free account to sync across devices — or start as a guest. Either way,{' '}
        <strong style={{ color: '#d4a060' }}>your streak and prayers are saved on this device.</strong>
      </p>

      {/* Primary CTA */}
      <button onClick={onSignUp} style={{
        width: '100%', maxWidth: 300, padding: '16px 0',
        background: 'linear-gradient(135deg, #c45510, #8c2e00)',
        border: 'none', borderRadius: 14, cursor: 'pointer',
        color: '#fff8e0', fontSize: 16, fontWeight: 700,
        fontFamily: 'Georgia, serif', letterSpacing: 0.5,
        boxShadow: '0 4px 20px rgba(196,85,16,0.45)',
        marginBottom: 12,
      }}>
        Create Free Account
      </button>

      {/* Guest CTA */}
      <button onClick={onGuest} style={{
        width: '100%', maxWidth: 300, padding: '14px 0',
        background: 'transparent',
        border: '1px solid rgba(201,130,10,0.35)',
        borderRadius: 14, cursor: 'pointer',
        color: '#c9820a', fontSize: 14,
        fontFamily: 'Georgia, serif',
        marginBottom: 24,
      }}>
        Continue as guest
      </button>

      {/* Guest reassurance */}
      <div style={{
        padding: '10px 18px',
        background: 'rgba(201,130,10,0.06)',
        border: '1px solid rgba(201,130,10,0.18)',
        borderRadius: 10, maxWidth: 290,
      }}>
        <p style={{ fontSize: 11.5, color: '#8a6030', fontFamily: 'Georgia, serif', margin: 0, lineHeight: 1.6 }}>
          🔒 Guest data is saved locally on this device. Create an account anytime to back it up.
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
const SCREENS = [{ id: 0 }, { id: 1 }, { id: 2 }];

export default function Onboarding({ onSignUp, onGuest }) {
  const [current, setCurrent] = useState(0);

  const goNext = () => { if (current < SCREENS.length - 1) setCurrent(current + 1); };
  const goPrev = () => { if (current > 0) setCurrent(current - 1); };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 50% 30%, #3d1200 0%, #1a0600 55%, #0a0200 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Georgia, serif',
      overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,85,16,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Skip button — screens 1 & 2 only */}
      {current < 2 && (
        <button onClick={() => setCurrent(2)} style={{
          position: 'absolute', top: 20, right: 20,
          background: 'none', border: 'none',
          color: '#6a4020', fontSize: 13, cursor: 'pointer',
          fontFamily: 'Georgia, serif', zIndex: 10,
        }}>Skip</button>
      )}

      {/* Screen content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {current === 0 && <Screen1 />}
        {current === 1 && <Screen2 />}
        {current === 2 && <Screen3 onSignUp={onSignUp} onGuest={onGuest} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        padding: '20px 32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        {/* Back */}
        <button onClick={goPrev} style={{
          background: 'none',
          border: '1px solid rgba(201,130,10,0.25)',
          borderRadius: 10, padding: '10px 20px',
          color: current === 0 ? 'transparent' : '#c9820a',
          cursor: current === 0 ? 'default' : 'pointer',
          fontSize: 13, fontFamily: 'Georgia, serif',
          pointerEvents: current === 0 ? 'none' : 'auto',
        }}>← Back</button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {SCREENS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 7,
                height: 7, borderRadius: 4,
                background: i === current ? '#c9820a' : 'rgba(201,130,10,0.25)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next / spacer on last screen */}
        {current < 2 ? (
          <button onClick={goNext} style={{
            background: 'rgba(201,130,10,0.15)',
            border: '1px solid rgba(201,130,10,0.4)',
            borderRadius: 10, padding: '10px 20px',
            color: '#c9820a', cursor: 'pointer',
            fontSize: 13, fontFamily: 'Georgia, serif',
          }}>Next →</button>
        ) : (
          <div style={{ width: 80 }} />
        )}
      </div>
    </div>
  );
}
