// App icon — flame representing the fire of prayer
// Named DoveIcon for backwards compatibility (used in header + daily verse)
import { Flame } from 'lucide-react';

export default function DoveIcon({ size = 24, color = 'currentColor' }) {
  return <Flame size={size} color={color} strokeWidth={size >= 24 ? 1.75 : 2} />;
}
