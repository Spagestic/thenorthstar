"use client";

import { Orb } from "@/components/ui/orb";

interface CallOrbProps {
  getInputVolume: () => number;
  getOutputVolume: () => number;
}

export function CallOrb({ getInputVolume, getOutputVolume }: CallOrbProps) {
  return (
    <div className="relative size-32">
      <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
        <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
          <Orb
            className="h-full w-full"
            volumeMode="manual"
            getInputVolume={getInputVolume}
            getOutputVolume={getOutputVolume}
          />
        </div>
      </div>
    </div>
  );
}
