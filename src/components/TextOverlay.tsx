/**
 * TextOverlay.tsx — Bold viral-style text overlays
 *
 * Features:
 * - Thick stroke outlines for readability
 * - Bounce / shake / glow entrance animations
 * - Emoji support
 * - Top/bottom/center positioning
 */

import React from "react";
import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
} from "remotion";

export type TextAnimation = "bounce" | "shake" | "fade" | "slam" | "typewriter" | "none";
export type TextPosition = "top" | "center" | "bottom";

export interface TextOverlayProps {
  text: string;
  position?: TextPosition;
  animation?: TextAnimation;
  fontSize?: number;
  color?: string;
  strokeColor?: string;
  enterFrame?: number;
  exitFrame?: number;
  emoji?: string;
  subtext?: string;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  position = "top",
  animation = "bounce",
  fontSize = 52,
  color = "#FFFFFF",
  strokeColor = "#000000",
  enterFrame = 0,
  exitFrame,
  emoji,
  subtext,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const relativeFrame = frame - enterFrame;
  if (relativeFrame < 0) return null;
  if (exitFrame !== undefined && frame >= exitFrame) return null;

  // Position Y
  const posY =
    position === "top"
      ? 120
      : position === "bottom"
        ? height - 120
        : height / 2;

  // Animation transforms
  let scale = 1;
  let opacity = 1;
  let translateY = 0;
  let rotation = 0;

  switch (animation) {
    case "bounce": {
      const s = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 8, stiffness: 150, mass: 0.6 },
      });
      scale = s;
      break;
    }
    case "slam": {
      const s = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 6, stiffness: 200, mass: 1 },
      });
      scale = interpolate(s, [0, 1], [5, 1]);
      opacity = s;
      break;
    }
    case "shake": {
      const s = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 12, stiffness: 100 },
      });
      scale = s;
      if (relativeFrame < 15) {
        rotation = Math.sin(relativeFrame * 2) * 5 * (1 - relativeFrame / 15);
      }
      break;
    }
    case "fade": {
      opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
        extrapolateRight: "clamp",
      });
      translateY = interpolate(relativeFrame, [0, 10], [20, 0], {
        extrapolateRight: "clamp",
      });
      break;
    }
    case "typewriter": {
      const chars = Math.floor(
        interpolate(relativeFrame, [0, text.length * 2], [0, text.length], {
          extrapolateRight: "clamp",
        })
      );
      text = text.slice(0, chars);
      break;
    }
  }

  // Exit fade
  if (exitFrame !== undefined) {
    const exitDist = exitFrame - frame;
    if (exitDist < 10) {
      opacity *= interpolate(exitDist, [0, 10], [0, 1]);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: posY + translateY,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        pointerEvents: "none",
      }}
    >
      {emoji && (
        <div style={{ fontSize: fontSize * 1.2, marginBottom: 8 }}>{emoji}</div>
      )}
      <div
        style={{
          fontSize,
          fontFamily: "'Arial Black', 'Impact', sans-serif",
          fontWeight: 900,
          color,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 2,
          WebkitTextStroke: `${Math.max(2, fontSize / 15)}px ${strokeColor}`,
          paintOrder: "stroke fill",
          lineHeight: 1.2,
          padding: "0 40px",
          textShadow: `0 4px 20px rgba(0,0,0,0.6)`,
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: fontSize * 0.5,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            color: "#FFD700",
            marginTop: 8,
            textTransform: "uppercase",
            letterSpacing: 3,
            WebkitTextStroke: `1px ${strokeColor}`,
            paintOrder: "stroke fill",
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
