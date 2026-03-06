// Reusable neon praying-hands image component.
// mix-blend-mode: screen makes the black photo background invisible,
// leaving only the glowing cyan/red neon — works on any dark surface.
import prayingHandsImg from '../assets/praying-hands.jpg';

export default function PrayingHands({ size = 24, style = {} }) {
  return (
    <img
      src={prayingHandsImg}
      alt="🙏"
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        objectPosition: '50% 28%', // crops to center on the hands, not the black space below
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        mixBlendMode: 'screen',    // black background becomes transparent
        borderRadius: size >= 48 ? 12 : 2,
        ...style,
      }}
    />
  );
}
