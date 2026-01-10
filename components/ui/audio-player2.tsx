"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, FastForward, Rewind } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function AudioPlayer({
  audioUrl,
  className = "",
}: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Helper to grab the computed color values from your CSS variables
    // This ensures we use the exact oklch values defined in your globals.css
    const getThemeColor = (variable: string) => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();
    };

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      // Use 'muted' for the unplayed part of the wave
      waveColor: getThemeColor("--muted") || "#e5e7eb",
      // Use 'primary' for the played part (progress)
      progressColor: getThemeColor("--primary") || "#000000",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 64, // 4rem
      normalize: true,
      url: audioUrl,
    });

    // --- Event Listeners (Fixed for WaveSurfer v7) ---

    wavesurfer.on("ready", () => {
      setIsReady(true);
      setDuration(wavesurfer.getDuration());
    });

    // 'timeupdate' fires continuously during playback
    wavesurfer.on("timeupdate", (currentTime) => {
      setCurrentTime(currentTime);
    });

    // 'interaction' replaces the old 'seek' event for user clicks
    wavesurfer.on("interaction", (newTime) => {
      setCurrentTime(newTime);
    });

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  // Controls
  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(10);
    }
  };

  const skipBackward = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(-10);
    }
  };

  const toggleSpeed = () => {
    if (wavesurferRef.current) {
      const speeds = [1, 1.25, 1.5, 2, 0.5];
      const nextSpeedIndex =
        (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
      const nextSpeed = speeds[nextSpeedIndex];
      wavesurferRef.current.setPlaybackRate(nextSpeed);
      setPlaybackSpeed(nextSpeed);
    }
  };

  return (
    <div
      className={`w-full max-w-3xl bg-card text-card-foreground rounded-xl p-6 shadow-lg border border-border ${className}`}
    >
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg tracking-tight">
          Conversation Recording
        </h2>
        <span className="text-xs font-mono text-muted-foreground truncate max-w-40">
          {audioUrl.split("/").pop()}
        </span>
      </div>

      {/* Waveform Container */}
      <div className="relative group">
        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-card/50 backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Actual Waveform */}
        <div
          ref={containerRef}
          className="w-full cursor-pointer transition-opacity hover:opacity-90"
        />

        {/* Tooltip Overlay */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
          Click to seek
        </div>
      </div>

      {/* Controls Area */}
      <div className="flex items-center justify-between mt-6">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={skipBackward}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Rewind 10s"
            >
              <Rewind className="w-5 h-5" />
            </button>
            <button
              onClick={skipForward}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Skip 10s"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={toggleSpeed}
            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-transparent hover:border-border transition-all min-w-12"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Right: Timer */}
        <div className="font-mono text-sm text-muted-foreground">
          <span className="text-foreground font-medium">
            {formatTime(currentTime)}
          </span>
          <span className="mx-1 opacity-50">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
