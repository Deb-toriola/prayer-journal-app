/**
 * getStreakTheme(streak)
 * Returns visual theme tokens for the daily streak card.
 * Colour palette: always amber/fire — never green.
 * Grows hotter (darker, more intense) as streak climbs.
 * Resets to warm amber when streak breaks.
 */
export function getStreakTheme(streak) {
  if (streak >= 60) {
    return {
      background: 'linear-gradient(135deg, #5a1000 0%, #3d0800 55%, #2a0500 100%)',
      boxShadow: '0 4px 28px rgba(61, 8, 0, 0.75), 0 0 48px rgba(255, 150, 0, 0.18)',
      label: 'The fire never goes out',
      flameSize: 52,
      flameFilter: 'drop-shadow(0 0 14px rgba(255, 200, 0, 0.95)) drop-shadow(0 0 28px rgba(255, 120, 0, 0.6))',
      goldText: true,
    };
  }
  if (streak >= 30) {
    return {
      background: 'linear-gradient(135deg, #8b1a00 0%, #6d0f00 55%, #4a0a00 100%)',
      boxShadow: '0 4px 24px rgba(109, 15, 0, 0.65)',
      label: 'Unquenchable',
      flameSize: 48,
      flameFilter: 'drop-shadow(0 0 10px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 22px rgba(255, 80, 0, 0.38))',
      goldText: false,
    };
  }
  if (streak >= 14) {
    return {
      background: 'linear-gradient(135deg, #a83200 0%, #8b1a00 55%, #6d0f00 100%)',
      boxShadow: '0 4px 22px rgba(139, 26, 0, 0.58)',
      label: 'Burning bright',
      flameSize: 46,
      flameFilter: 'drop-shadow(0 0 8px rgba(255, 130, 0, 0.65)) drop-shadow(0 0 18px rgba(255, 60, 0, 0.28))',
      goldText: false,
    };
  }
  if (streak >= 7) {
    return {
      background: 'linear-gradient(135deg, #c83a00 0%, #a83200 55%, #8a2800 100%)',
      boxShadow: '0 4px 20px rgba(168, 50, 0, 0.52)',
      label: 'On fire 🔥',
      flameSize: 44,
      flameFilter: 'drop-shadow(0 0 6px rgba(255, 150, 0, 0.55)) drop-shadow(0 0 14px rgba(255, 80, 0, 0.22))',
      goldText: false,
    };
  }
  if (streak >= 4) {
    return {
      background: 'linear-gradient(135deg, #d97214 0%, #c45510 55%, #a84000 100%)',
      boxShadow: '0 4px 18px rgba(196, 85, 16, 0.48)',
      label: 'Finding your rhythm',
      flameSize: 42,
      flameFilter: 'drop-shadow(0 0 4px rgba(255, 170, 0, 0.45)) drop-shadow(0 0 10px rgba(200, 80, 0, 0.18))',
      goldText: false,
    };
  }
  // 0–3 days — warm amber baseline (also the reset state after a break)
  return {
    background: 'linear-gradient(135deg, #e08020 0%, #d4720a 55%, #b85800 100%)',
    boxShadow: '0 4px 16px rgba(212, 114, 10, 0.42)',
    label: streak === 0 ? 'Start your streak today' : 'Getting started',
    flameSize: 40,
    flameFilter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.22))',
    goldText: false,
  };
}
