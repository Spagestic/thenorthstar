"use client";

import { Warp } from "@paper-design/shaders-react";

// 1. Define the interface for the shader parameters
export interface WarpParams {
  proportion?: number;
  softness?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  shape?: "checks" | "stripes" | "edge";
  shapeScale?: number;
  speed?: number;
  scale?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}

interface AiOrbProps extends WarpParams {
  /**
   * Array of 3 hex color strings.
   * Defaults to Blue theme: ["#ade7ff", "#ebf4ff", "#00bbff"]
   */
  colors?: [string, string, string];
  /**
   * Optional className to adjust container size and styles.
   */
  className?: string;
  /**
   * Resolution width of the shader canvas.
   */
  width?: number;
  /**
   * Resolution height of the shader canvas.
   */
  height?: number;
}

const DEFAULT_SHAPE_PARAMS = {
  proportion: 0.35,
  softness: 1,
  distortion: 0.32,
  swirl: 1,
  swirlIterations: 0,
  shape: "edge" as const,
  shapeScale: 0,
  speed: 12.2,
  scale: 0.31,
  rotation: 176,
  offsetX: 0.65,
  offsetY: 0.09,
};

const DEFAULT_COLORS = ["#ade7ff", "#ebf4ff", "#00bbff"];

export function AiOrb({
  className = "",
  width = 280,
  height = 280,
  colors = DEFAULT_COLORS as [string, string, string],
  ...shaderProps // Capture all other WarpParams
}: AiOrbProps) {
  // Merge defaults with passed props
  const params = { ...DEFAULT_SHAPE_PARAMS, ...shaderProps };

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{
        width: className ? undefined : width,
        height: className ? undefined : height,
      }}
    >
      <Warp
        width={width}
        height={height}
        colors={colors}
        proportion={params.proportion}
        softness={params.softness}
        distortion={params.distortion}
        swirl={params.swirl}
        swirlIterations={params.swirlIterations}
        shape={params.shape}
        shapeScale={params.shapeScale}
        speed={params.speed}
        scale={params.scale}
        rotation={params.rotation}
        offsetX={params.offsetX}
        offsetY={params.offsetY}
      />
    </div>
  );
}
