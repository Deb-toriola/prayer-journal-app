// BACKUP — Original Screen 3 (CTA / Get Started) from Onboarding.jsx
// Saved before onboarding rebuild

import prayingHandsImg from '../assets/praying-hands.jpg';

export default function Screen3({ onSignUp, onGuest }) {
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
