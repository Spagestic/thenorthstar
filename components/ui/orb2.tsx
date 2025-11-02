"use client";

import { useEffect, useRef, useState } from "react";

export type AgentState = null | "thinking" | "listening" | "talking";

type OrbProps = {
  colors?: [string, string];
  agentState?: AgentState;
  className?: string;
  size?: number; // Add size prop in pixels
};

export function Orb({
  colors = ["#CADCFC", "#A0B9D1"],
  agentState = null,
  className,
  size = 200, // Default size
}: OrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!orbRef.current) return;

    orbRef.current.style.setProperty("--color-1", colors[0]);
    orbRef.current.style.setProperty("--color-2", colors[1]);
    orbRef.current.style.setProperty("--orb-size", `${size}px`);
  }, [colors, size]);

  useEffect(() => {
    if (!orbRef.current) return;

    orbRef.current.classList.remove("thinking", "listening", "talking", "idle");
    orbRef.current.classList.add(agentState ?? "idle");
  }, [agentState]);

  return (
    <div className={className ?? "relative h-full w-full"}>
      <div
        ref={orbRef}
        className={`orb-container idle ${mounted ? "mounted" : ""}`}
        style={
          {
            "--color-1": colors[0],
            "--color-2": colors[1],
            "--orb-size": `${size}px`,
          } as React.CSSProperties
        }
      >
        <div className="orb-core" />
        <div className="orb-layer orb-layer-1" />
        <div className="orb-layer orb-layer-2" />
        <div className="orb-layer orb-layer-3" />
        <div className="orb-layer orb-layer-4" />
        <div className="orb-ring orb-ring-1" />
        <div className="orb-ring orb-ring-2" />
        <div className="orb-glow" />
      </div>

      <style jsx>{`
        .orb-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease-in;
        }

        .orb-container.mounted {
          opacity: 1;
        }

        .orb-core,
        .orb-layer,
        .orb-ring,
        .orb-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        /* Core orb with complex gradient */
        .orb-core {
          width: var(--orb-size);
          height: var(--orb-size);
          background: radial-gradient(
              circle at 35% 35%,
              rgba(255, 255, 255, 0.8),
              transparent 40%
            ),
            radial-gradient(
              circle at 65% 65%,
              var(--color-1),
              var(--color-2) 60%
            ),
            radial-gradient(circle at center, var(--color-2), #000000 100%);
          animation: pulse-core 3s ease-in-out infinite;
          z-index: 2;
          box-shadow: inset 0 0 60px rgba(255, 255, 255, 0.2),
            0 0 40px rgba(0, 0, 0, 0.1);
        }

        /* Animated layers for flowing effect */
        .orb-layer {
          width: var(--orb-size);
          height: var(--orb-size);
          mix-blend-mode: screen;
          opacity: 0.5;
          z-index: 3;
        }

        .orb-layer-1 {
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            var(--color-1) 30deg,
            transparent 60deg,
            var(--color-1) 90deg,
            transparent 120deg,
            var(--color-2) 180deg,
            transparent 210deg,
            var(--color-2) 240deg,
            transparent 270deg,
            var(--color-1) 330deg,
            transparent 360deg
          );
          animation: rotate-layer-1 10s linear infinite;
          filter: blur(30px);
        }

        .orb-layer-2 {
          background: conic-gradient(
            from 180deg at 50% 50%,
            transparent 0deg,
            var(--color-2) 45deg,
            transparent 90deg,
            var(--color-1) 135deg,
            transparent 180deg,
            var(--color-2) 225deg,
            transparent 270deg,
            var(--color-1) 315deg,
            transparent 360deg
          );
          animation: rotate-layer-2 15s linear infinite reverse;
          filter: blur(35px);
        }

        .orb-layer-3 {
          background: radial-gradient(
              ellipse 60% 80% at 30% 50%,
              var(--color-1) 0%,
              transparent 40%
            ),
            radial-gradient(
              ellipse 60% 80% at 70% 50%,
              var(--color-2) 0%,
              transparent 40%
            );
          animation: rotate-layer-3 8s linear infinite,
            morph 5s ease-in-out infinite;
          filter: blur(25px);
        }

        .orb-layer-4 {
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            var(--color-1) 0deg,
            transparent 10deg,
            var(--color-2) 20deg,
            transparent 30deg
          );
          animation: rotate-layer-4 20s linear infinite;
          filter: blur(40px);
          opacity: 0.3;
        }

        /* Rings for activity visualization */
        .orb-ring {
          width: calc(var(--orb-size) * 1.13);
          height: calc(var(--orb-size) * 1.13);
          border: 3px solid var(--color-1);
          opacity: 0;
          mix-blend-mode: screen;
          animation: ring-pulse 2s ease-in-out infinite;
          z-index: 4;
          filter: blur(2px);
        }

        .orb-ring-2 {
          animation-delay: 1s;
          border-color: var(--color-2);
          width: calc(var(--orb-size) * 1.2);
          height: calc(var(--orb-size) * 1.2);
        }

        /* Outer glow */
        .orb-glow {
          width: calc(var(--orb-size) * 1.33);
          height: calc(var(--orb-size) * 1.33);
          background: radial-gradient(
            circle at center,
            var(--color-1) 0%,
            var(--color-2) 30%,
            transparent 60%
          );
          filter: blur(50px);
          opacity: 0.3;
          animation: glow-pulse 3s ease-in-out infinite;
          z-index: 1;
        }

        /* State: Idle - gentle, slow animations */
        .orb-container.idle .orb-core {
          animation: pulse-core 4s ease-in-out infinite;
        }

        .orb-container.idle .orb-layer-1 {
          animation: rotate-layer-1 12s linear infinite;
        }

        .orb-container.idle .orb-layer-2 {
          animation: rotate-layer-2 18s linear infinite reverse;
        }

        .orb-container.idle .orb-ring {
          opacity: 0.15;
          animation: ring-pulse-slow 4s ease-in-out infinite;
        }

        /* State: Thinking - moderate activity */
        .orb-container.thinking .orb-core {
          animation: pulse-core 2.5s ease-in-out infinite;
        }

        .orb-container.thinking .orb-layer-1 {
          animation: rotate-layer-1 8s linear infinite;
        }

        .orb-container.thinking .orb-layer-2 {
          animation: rotate-layer-2 12s linear infinite reverse;
        }

        .orb-container.thinking .orb-layer-3 {
          animation: rotate-layer-3 6s linear infinite,
            morph 4s ease-in-out infinite;
        }

        .orb-container.thinking .orb-ring {
          opacity: 0.25;
          animation: ring-pulse 2.5s ease-in-out infinite;
        }

        /* State: Listening - responsive, medium speed */
        .orb-container.listening .orb-core {
          animation: pulse-core 1.8s ease-in-out infinite;
        }

        .orb-container.listening .orb-layer-1 {
          animation: rotate-layer-1 5s linear infinite;
        }

        .orb-container.listening .orb-layer-2 {
          animation: rotate-layer-2 7s linear infinite reverse;
        }

        .orb-container.listening .orb-layer-3 {
          animation: rotate-layer-3 4s linear infinite,
            morph 3s ease-in-out infinite;
        }

        .orb-container.listening .orb-ring {
          opacity: 0.4;
          animation: ring-pulse-fast 1.5s ease-in-out infinite;
        }

        .orb-container.listening .orb-glow {
          animation: glow-pulse 1.8s ease-in-out infinite;
          opacity: 0.4;
        }

        /* State: Talking - high activity, fast animations */
        .orb-container.talking .orb-core {
          animation: pulse-core 1s ease-in-out infinite,
            scale-talking 0.8s ease-in-out infinite;
        }

        .orb-container.talking .orb-layer-1 {
          animation: rotate-layer-1 3s linear infinite;
          opacity: 0.7;
        }

        .orb-container.talking .orb-layer-2 {
          animation: rotate-layer-2 4s linear infinite reverse;
          opacity: 0.7;
        }

        .orb-container.talking .orb-layer-3 {
          animation: rotate-layer-3 2.5s linear infinite,
            morph 2s ease-in-out infinite;
          opacity: 0.6;
        }

        .orb-container.talking .orb-layer-4 {
          animation: rotate-layer-4 10s linear infinite;
          opacity: 0.5;
        }

        .orb-container.talking .orb-ring {
          opacity: 0.6;
          animation: ring-pulse-talking 0.7s ease-in-out infinite;
        }

        .orb-container.talking .orb-glow {
          animation: glow-pulse 1s ease-in-out infinite;
          opacity: 0.6;
        }

        /* Keyframe Animations */

        @keyframes pulse-core {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.03);
          }
        }

        @keyframes scale-talking {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }

        @keyframes rotate-layer-1 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes rotate-layer-2 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes rotate-layer-3 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes rotate-layer-4 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes morph {
          0%,
          100% {
            border-radius: 48% 52% 53% 47% / 45% 50% 50% 55%;
          }
          25% {
            border-radius: 52% 48% 45% 55% / 53% 47% 53% 47%;
          }
          50% {
            border-radius: 45% 55% 52% 48% / 55% 45% 47% 53%;
          }
          75% {
            border-radius: 53% 47% 48% 52% / 47% 53% 52% 48%;
          }
        }

        @keyframes ring-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.92);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.4;
          }
        }

        @keyframes ring-pulse-slow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.04);
            opacity: 0.2;
          }
        }

        @keyframes ring-pulse-fast {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.88);
            opacity: 0.1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: 0.5;
          }
        }

        @keyframes ring-pulse-talking {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.7;
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.45;
          }
        }

        /* Dark mode support */
        :global(.dark) .orb-core {
          background: radial-gradient(
              circle at 35% 35%,
              rgba(255, 255, 255, 0.9),
              transparent 35%
            ),
            radial-gradient(
              circle at 65% 65%,
              var(--color-2),
              var(--color-1) 60%
            ),
            radial-gradient(circle at center, var(--color-1), #ffffff 100%);
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 255, 255, 0.1);
        }

        :global(.dark) .orb-layer {
          opacity: 0.7;
        }

        :global(.dark) .orb-glow {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
