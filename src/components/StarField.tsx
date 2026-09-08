import { useMemo } from 'react';

export default function StarField() {
  const stars = useMemo(() => Array.from({ length: 150 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 72}%`, size: Math.random() * 2.6 + .7,
    delay: `${Math.random() * 5}s`, duration: `${2 + Math.random() * 4}s`
  })), []);
  return <div className="star-field">{stars.map(s => <i key={s.id} style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />)}</div>;
}
