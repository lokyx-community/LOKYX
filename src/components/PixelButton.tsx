import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PixelButton({ children, onClick, secondary=false }: {children: ReactNode; onClick?:()=>void; secondary?:boolean}) {
  return <motion.button whileHover={{y:-2, scale:1.01}} whileTap={{scale:.98}} className={`pixel-btn ${secondary ? "secondary":""}`} onClick={onClick}>{children}</motion.button>;
}