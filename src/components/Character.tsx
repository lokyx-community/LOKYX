import { motion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL;

export default function Character({
  small = false,
}: {
  small?: boolean;
}) {
  return (
    <motion.div
      className={`traveler-character traveler-art ${
        small ? 'small' : ''
      }`}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="char-aura" />

      <img
        src={`${BASE}assets/traveler.png`}
        alt="LOKYX Traveler"
        draggable={false}
      />
    </motion.div>
  );
}