"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export type ShaderBackgroundProps = {
  children: React.ReactNode;
};

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black"
      ref={containerRef}
    >
      {/* SVG Filters */}
      {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          <filter
            height="200%"
            id="glass-effect"
            width="200%"
            x="-50%"
            y="-50%"
          >
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              result="tint"
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
            />
          </filter>
          <filter
            height="200%"
            id="gooey-filter"
            width="200%"
            x="-50%"
            y="-50%"
          >
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="4" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="gooey"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#e0eaff", "#241d9a", "#f75092", "#9f50d3"]}
        distortion={0.8}
        grainMixer={0}
        grainOverlay={0}
        // height={720}
        speed={0.1}
        swirl={0.1}
        // width={1280}
      />

      {children}
    </div>
  );
}
