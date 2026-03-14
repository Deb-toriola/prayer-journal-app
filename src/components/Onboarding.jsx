import { useState, useRef, useCallback } from 'react';
import { BookOpen, Flame, Award } from 'lucide-react';
import geminiHandsImg from '../assets/gemini-hands.jpg';

const TOTAL_SCREENS = 3;

// ── Screen 1: Splash ─────────────────────────────────────────
function Screen1({ onGetStarted, onSignIn }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      height: '100%', padding: '40px 32px 48px',
      textAlign: 'center', alignItems: 'center',
    }}>
      <div style={{ marginTop: 'auto' }} />

      <h1 style={{
        fontSize: 32, fontWeight: 700, lineHeight: 1.2,
        fontFamily: 'Georgia, serif',
        color: '#F5D888',
        marginBottom: 8,
      }}>
        A Quiet Place{'\n'}to Pray
      </h1>

      <p style={{
        fontSize: 14, lineHeight: 1.65, color: '#F0EAE0',
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        maxWidth: 280,
      }}>
        Reflect. Record. Return.
      </p>

      <div style={{ height: 24 }} />

      {/* Get Started pill button */}
      <button onClick={onGetStarted} style={{
        width: '100%', maxWidth: 320, padding: '16px 0',
        background: '#FFFFFF',
        border: 'none', borderRadius: 50, cursor: 'pointer',
        color: '#1A0900', fontSize: 16, fontWeight: 700,
        fontFamily: 'Georgia, serif', letterSpacing: 0.5,
        boxShadow: '0 4px 20px rgba(201,128,58,0.4)',
      }}>
        Get Started
      </button>

      {/* Sign in link */}
      <p style={{ marginTop: 16, fontSize: 13, color: '#F0EAE0', fontFamily: 'Georgia, serif' }}>
        Already have an account?{' '}
        <span
          onClick={onSignIn}
          style={{ color: '#F5D888', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign in
        </span>
      </p>
    </div>
  );
}

// ── Screen 2: Features ────────────────────────────────────────
function Screen2() {
  const features = [
    { Icon: BookOpen, label: 'Journal your prayers', sub: 'Write by category. Add scripture. Build a record of your prayer life.' },
    { Icon: Flame, label: 'Build your streak', sub: 'Track every day you show up — whether logged in or as a guest.' },
    { Icon: Award, label: 'Record testimonies', sub: 'When God comes through, log it. Read how far He\'s brought you.' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      height: '100%', padding: '40px 32px 100px',
      overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      <p style={{ fontSize: 10, letterSpacing: 5, color: '#FFFFFF', marginBottom: 10, fontFamily: 'Georgia, serif', textAlign: 'center' }}>WHAT YOU CAN DO</p>
      <h2 style={{
        fontSize: 32, fontWeight: 700, lineHeight: 1.2, textAlign: 'center',
        fontFamily: 'Georgia, serif',
        color: '#F5D888',
        marginBottom: 24,
      }}>Pray with purpose.</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '14px 16px',
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(201,130,10,0.2)',
            borderRadius: 14,
          }}>
            <f.Icon size={24} color="#f5d080" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f5d080', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>{f.label}</p>
              <p style={{ fontSize: 12, color: '#F0EAE0', lineHeight: 1.5, fontFamily: 'Georgia, serif', margin: 0 }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: Get Started ─────────────────────────────────────
function Screen3({ onSignUp, onGuest }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%', padding: '40px 32px 100px', textAlign: 'center',
      overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      <h2 style={{
        fontSize: 28, fontWeight: 700, lineHeight: 1.2,
        fontFamily: 'Georgia, serif',
        color: '#F5D888',
        marginBottom: 12,
      }}>Your prayers are waiting.</h2>

      <p style={{ fontSize: 13, lineHeight: 1.6, color: '#F0EAE0', fontFamily: 'Georgia, serif', maxWidth: 280, marginBottom: 24 }}>
        Create a free account to sync across devices — or start as a guest. Either way,{' '}
        <strong style={{ color: '#F0EAE0' }}>your streak and prayers are saved on this device.</strong>
      </p>

      {/* Primary CTA */}
      <button onClick={onSignUp} style={{
        width: '100%', maxWidth: 300, padding: '16px 0',
        background: '#FFFFFF',
        border: 'none', borderRadius: 50, cursor: 'pointer',
        color: '#1A0900', fontSize: 16, fontWeight: 700,
        fontFamily: 'Georgia, serif', letterSpacing: 0.5,
        boxShadow: '0 4px 20px rgba(201,128,58,0.4)',
        marginBottom: 12,
      }}>
        Create Free Account
      </button>

      {/* Guest CTA */}
      <button onClick={onGuest} style={{
        width: '100%', maxWidth: 300, padding: '14px 0',
        background: 'transparent',
        border: '1.5px solid rgba(255,255,255,0.6)',
        borderRadius: 50, cursor: 'pointer',
        color: '#FFFFFF', fontSize: 14,
        fontFamily: 'Georgia, serif',
        marginBottom: 8,
      }}>
        Continue as guest
      </button>

      {/* Data reassurance */}
      <p style={{ fontSize: 11, color: '#F0EAE0', fontFamily: 'Georgia, serif', margin: 0, lineHeight: 1.5 }}>
        Your data stays on this device
      </p>
    </div>
  );
}

// ── Pagination dots ──────────────────────────────────────────
function Dots({ current, total, onDotPress }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onDotPress(i)}
          style={{
            width: i === current ? 20 : 7,
            height: 7, borderRadius: 4,
            background: i === current ? '#C9803A' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// ── Main Onboarding container ────────────────────────────────
export default function Onboarding({ onSignUp, onGuest, onSignIn }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(TOTAL_SCREENS - 1, index));
    setCurrent(clamped);
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: width * clamped, behavior: 'smooth' });
    }
  }, []);

  const goNext = () => goTo(current + 1);
  const goPrev = () => goTo(current - 1);

  // Handle swipe on the pager
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    // Only swipe if horizontal movement dominates
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goNext(); else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Sync dot indicator when user scrolls manually
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    const page = Math.round(scrollLeft / offsetWidth);
    if (page !== current && page >= 0 && page < TOTAL_SCREENS) {
      setCurrent(page);
    }
  };

  // Gradient: lighter on screen 1, darker on screens 2 & 3
  const gradientOverlay = current === 0
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.85) 100%)'
    : 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.75) 100%)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      fontFamily: 'Georgia, serif',
      overflow: 'hidden',
    }}>
      {/* ── Persistent background image (never re-renders) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${geminiHandsImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* ── Dark gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: gradientOverlay,
        pointerEvents: 'none',
        transition: 'background 0.4s ease',
      }} />

      {/* ── Skip button (all screens except last) ── */}
      {current < TOTAL_SCREENS - 1 && (
        <button onClick={() => goTo(TOTAL_SCREENS - 1)} style={{
          position: 'absolute', top: 52, right: 20,
          background: 'none', border: 'none',
          color: '#FFFFFF', fontSize: 13, cursor: 'pointer',
          fontFamily: 'Georgia, serif', zIndex: 10,
          padding: '8px 12px',
        }}>Skip</button>
      )}

      {/* ── Horizontal pager (FlatList-style) ── */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          overflowX: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Page 1 */}
        <div style={{
          minWidth: '100%', height: '100%',
          scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
        }}>
          <Screen1 onGetStarted={goNext} onSignIn={onSignIn} />
        </div>

        {/* Page 2 */}
        <div style={{
          minWidth: '100%', height: '100%',
          scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
        }}>
          <Screen2 />
        </div>

        {/* Page 3 */}
        <div style={{
          minWidth: '100%', height: '100%',
          scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
        }}>
          <Screen3 onSignUp={onSignUp} onGuest={onGuest} />
        </div>
      </div>

      {/* ── Bottom nav (over the pager) ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        {/* Back button — hidden on screen 1 */}
        {current > 0 ? (
          <button onClick={goPrev} style={{
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.6)',
            borderRadius: 10, padding: '10px 20px',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: 13, fontFamily: 'Georgia, serif',
            pointerEvents: 'auto',
          }}>← Back</button>
        ) : (
          <div style={{ width: 80 }} />
        )}

        {/* Dots — hidden on screen 1 */}
        {current > 0 ? (
          <div style={{ pointerEvents: 'auto' }}>
            <Dots current={current} total={TOTAL_SCREENS} onDotPress={goTo} />
          </div>
        ) : (
          <div />
        )}

        {/* Next button — only on screen 2 */}
        {current === 1 ? (
          <button onClick={goNext} style={{
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.6)',
            borderRadius: 10, padding: '10px 20px',
            color: '#FFFFFF', cursor: 'pointer',
            fontSize: 13, fontFamily: 'Georgia, serif',
            pointerEvents: 'auto',
          }}>Next →</button>
        ) : (
          <div style={{ width: 80 }} />
        )}
      </div>
    </div>
  );
}
