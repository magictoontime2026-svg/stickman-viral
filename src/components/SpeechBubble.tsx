/**
 * SpeechBubble.tsx — Animated dialog bubbles with typing effect
 *
 * Supports multiple styles: speech, thought, shout, whisper
 */

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export type BubbleStyle = "speech" | "thought" | "shout" | "whisper" | "narrator";

export interface SpeechBubbleProps {
  text: string;
  x: number;
  y: number;
  tailDirection?: "left" | "right" | "down" | "none";
  style?: BubbleStyle;
  maxWidth?: number;
  fontSize?: number;
  enterFrame?: number;
  typewriter?: boolean;
  color?: string;
  bgColor?: string;
  emoji?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  x,
  y,
  tailDirection = "down",
  style = "speech",
  maxWidth = 280,
  fontSize = 22,
  enterFrame = 0,
  typewriter = true,
  color = "#000000",
  bgColor = "#FFFFFF",
  emoji,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - enterFrame;
  if (relativeFrame < 0) return null;

  // Pop-in animation
  const scaleSpring = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.5 },
  });

  // Typewriter effect
  const charCount = typewriter
    ? Math.floor(
        interpolate(relativeFrame, [0, text.length * 1.5], [0, text.length], {
          extrapolateRight: "clamp",
        })
      )
    : text.length;

  const displayText = text.slice(0, charCount);

  // Padding & sizing
  const paddingX = 20;
  const paddingY = 14;
  const lineHeight = fontSize * 1.3;

  // Simple word wrap estimation
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.55));
  const words = displayText.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length > charsPerLine) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  if (lines.length === 0) lines.push("");

  const boxWidth = maxWidth + paddingX * 2;
  const boxHeight = lines.length * lineHeight + paddingY * 2;

  const borderRadius = style === "shout" ? 5 : 15;
  const strokeWidth = style === "shout" ? 4 : 2;
  const strokeDash = style === "whisper" ? "6,4" : "none";
  const opacity = style === "whisper" ? 0.75 : 1;

  // Thought bubble dots
  const isThought = style === "thought";

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scaleSpring})`}
      opacity={opacity}
    >
      {/* Main bubble */}
      <rect
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={borderRadius}
        ry={borderRadius}
        fill={bgColor}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDash}
      />

      {/* Tail */}
      {tailDirection !== "none" && !isThought && (
        <polygon
          points={
            tailDirection === "down"
              ? `${-10},${boxHeight / 2 - 2} ${10},${boxHeight / 2 - 2} ${0},${boxHeight / 2 + 20}`
              : tailDirection === "left"
                ? `${-boxWidth / 2 + 2},${5} ${-boxWidth / 2 + 2},${-10} ${-boxWidth / 2 - 20},${15}`
                : `${boxWidth / 2 - 2},${5} ${boxWidth / 2 - 2},${-10} ${boxWidth / 2 + 20},${15}`
          }
          fill={bgColor}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        // Cover the border at junction
      )}

      {/* Thought bubble tail */}
      {isThought && tailDirection !== "none" && (
        <>
          <circle cx="0" cy={boxHeight / 2 + 12} r="6" fill={bgColor} stroke={color} strokeWidth={2} />
          <circle cx="5" cy={boxHeight / 2 + 25} r="4" fill={bgColor} stroke={color} strokeWidth={2} />
          <circle cx="8" cy={boxHeight / 2 + 35} r="2.5" fill={bgColor} stroke={color} strokeWidth={2} />
        </>
      )}

      {/* Text lines */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={-boxHeight / 2 + paddingY + lineHeight * (i + 0.75)}
          textAnchor="middle"
          fill={color}
          fontSize={style === "shout" ? fontSize * 1.15 : fontSize}
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight={style === "shout" ? "900" : "bold"}
          fontStyle={style === "whisper" ? "italic" : "normal"}
        >
          {line}
        </text>
      ))}

      {/* Emoji reaction */}
      {emoji && (
        <text
          x={boxWidth / 2 - 10}
          y={-boxHeight / 2 - 5}
          fontSize="28"
          textAnchor="middle"
        >
          {emoji}
        </text>
      )}
    </g>
  );
};
