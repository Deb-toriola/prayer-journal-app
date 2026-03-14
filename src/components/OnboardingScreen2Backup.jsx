// BACKUP — Original Screen 2 (Features) from Onboarding.jsx
// Saved before onboarding rebuild

export default function Screen2() {
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
