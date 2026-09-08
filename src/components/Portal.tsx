import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function Portal({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <motion.div
      className={`portal portal-art ${
        active ? 'active' : ''
      }`}
      animate={{
        y: [0, -3, 0],
        scale: [1, 1.008, 1],
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="portal-glow" />

      <img
        src={`${BASE}assets/gateway-portal.png`}
        alt="LOKYX dimensional portal"
        draggable={false}
      />

      <div className="portal-scan" />

      <div
        className="portal-particles"
        aria-hidden="true"
      >
        {Array.from(
          { length: 18 },
          (_, index) => (
            <i
              key={index}
              style={
                {
                  '--i': index,
                } as CSSProperties
              }
            />
          )
        )}
      </div>
    </motion.div>
  );
}