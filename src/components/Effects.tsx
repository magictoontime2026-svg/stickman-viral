/**
 * Effects.tsx — Visual effects for viral impact
 *
 * Particles, screen shake, flash, emoji rain, etc.
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/** Screen flash on dramatic moments */
export const ScreenFlash: React.FC<{
  triggerFrame: number;
  color?: string;
  duration?: number;
}> = ({ triggerFrame, color = "#FFFFFF", duration = 8 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rel = frame - triggerFrame;
  if (rel < 0 || rel > duration) return null;
  const opacity = interpolate(rel, [0, duration], [0.8, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

/** Emoji rain from top of screen */
export const EmojiRain: React.FC<{
  emoji: string;
  enterFrame?: number;
  count?: number;
  duration?: number;
}> = ({ emoji, enterFrame = 0, count = 15, duration = 60 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rel = frame - enterFrame;
  if (rel < 0 || rel > duration) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = ((i * 137.5) % width); // golden angle distribution
        const speed = 3 + (i % 5) * 2;
        const yPos = (rel * speed + i * 30) % (height + 100) - 50;
        const rot = (rel * 3 + i * 45) % 360;
        const size = 24 + (i % 3) * 12;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: yPos,
              fontSize: size,
              transform: `rotate(${rot}deg)`,
              opacity: 0.8,
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
};

/** Floating +1 / score popups */
export const FloatingScore: React.FC<{
  text: string;
  x: number;
  y: number;
  triggerFrame: number;
  color?: string;
}> = ({ text, x, y, triggerFrame, color = "#FFD700" }) => {
  const frame = useCurrentFrame();
  const rel = frame - triggerFrame;
  if (rel < 0 || rel > 30) return null;

  const offsetY = interpolate(rel, [0, 30], [0, -60]);
  const opacity = interpolate(rel, [0, 20, 30], [1, 1, 0]);
  const scale = interpolate(rel, [0, 5, 30], [0.5, 1.3, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + offsetY,
        fontSize: 32,
        fontWeight: 900,
        fontFamily: "'Arial Black', sans-serif",
        color,
        opacity,
        transform: `scale(${scale})`,
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

/** Screen shake wrapper */
export const ScreenShake: React.FC<{
  triggerFrame: number;
  intensity?: number;
  duration?: number;
  children: React.ReactNode;
}> = ({ triggerFrame, intensity = 8, duration = 12, children }) => {
  const frame = useCurrentFrame();
  const rel = frame - triggerFrame;
  let tx = 0;
  let ty = 0;

  if (rel >= 0 && rel < duration) {
    const decay = 1 - rel / duration;
    tx = Math.sin(rel * 5) * intensity * decay;
    ty = Math.cos(rel * 7) * intensity * decay;
  }

  return (
    <div
      style={{
        transform: `translate(${tx}px, ${ty}px)`,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

/** Dramatic zoom pulse */
export const ZoomPulse: React.FC<{
  triggerFrame: number;
  scale?: number;
  duration?: number;
  children: React.ReactNode;
}> = ({ triggerFrame, scale = 1.15, duration = 15, children }) => {
  const frame = useCurrentFrame();
  const rel = frame - triggerFrame;
  let s = 1;

  if (rel >= 0 && rel < duration) {
    s = interpolate(rel, [0, duration * 0.3, duration], [1, scale, 1]);
  }

  return (
    <div
      style={{
        transform: `scale(${s})`,
        transformOrigin: "center center",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

/** Progress bar (for "wait for it" moments) */
export const ProgressBar: React.FC<{
  enterFrame: number;
  duration: number;
  label?: string;
  color?: string;
}> = ({ enterFrame, duration, label = "Wait for it...", color = "#FF1744" }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const rel = frame - enterFrame;
  if (rel < 0 || rel > duration) return null;

  const progress = interpolate(rel, [0, duration], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: width * 0.1,
        right: width * 0.1,
      }}
    >
      <div
        style={{
          fontSize: 18,
          color: "#999",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 8,
          backgroundColor: "#222",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: color,
            borderRadius: 4,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
};
