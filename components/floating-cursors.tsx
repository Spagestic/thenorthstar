"use client";

import { motion } from "framer-motion";

// Helper to generate random consistent paths
const getRandomPath = (seed: number) => {
  // Simple pseudo-random logic to make each cursor move differently
  // but predictably based on its seed index
  return {
    x: [0, seed % 2 === 0 ? 40 : -40, seed % 3 === 0 ? -20 : 20, 0],
    y: [0, seed % 2 === 0 ? -30 : 30, seed % 3 === 0 ? -50 : 50, 0],
  };
};

const FloatingCursor = ({
  color,
  label,
  initialPosition,
  index,
}: {
  color: string;
  label: string;
  initialPosition: { top: string; left: string };
  index: number;
}) => {
  const path = getRandomPath(index);

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={initialPosition}
      animate={{
        x: path.x,
        y: path.y,
      }}
      transition={{
        duration: 15 + index * 2, // Vary duration so they don't sync up
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <div className="relative group">
        {/* Cursor Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform -rotate-12 drop-shadow-lg"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L11.7841 12.3673H5.65376Z"
            fill={color}
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        {/* Label Tag - Added backdrop blur for better readability */}
        <div
          className="absolute left-4 top-4 px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-lg backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-110"
          style={{ backgroundColor: color }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export function FloatingCursors() {
  const cursors = [
    { label: "Designer", color: "#FF5733", pos: { top: "20%", left: "15%" } },
    { label: "You", color: "#f59e0b", pos: { top: "15%", left: "80%" } },
    { label: "Recruiter", color: "#8839ef", pos: { top: "75%", left: "20%" } },
    { label: "Manager", color: "#d04f99", pos: { top: "60%", left: "70%" } },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {cursors.map((cursor, i) => (
        <FloatingCursor
          key={cursor.label}
          index={i}
          color={cursor.color}
          label={cursor.label}
          initialPosition={cursor.pos}
        />
      ))}
    </div>
  );
}
