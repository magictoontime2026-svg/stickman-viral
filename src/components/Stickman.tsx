/**
 * Stickman.tsx — The main stickman character component
 *
 * Features:
 * - Multiple emotions (happy, sad, angry, shocked, thinking, smug)
 * - Configurable poses (standing, walking, sitting, jumping, dancing, facepalm)
 * - Smooth limb animations
 * - Color/size customization for multi-character scenes
 */

import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "shocked"
  | "thinking"
  | "smug"
  | "crying"
  | "love";

export type Pose =
  | "standing"
  | "walking"
  | "sitting"
  | "jumping"
  | "dancing"
  | "facepalm"
  | "pointing"
  | "shrugging"
  | "waving"
  | "running"
  | "falling"
  | "celebrating";

export interface StickmanProps {
  x: number;
  y: number;
  emotion?: Emotion;
  pose?: Pose;
  color?: string;
  scale?: number;
  flip?: boolean;
  label?: string;
  animationOffset?: number;
}

/** Draws the facial expression */
const Face: React.FC<{ emotion: Emotion; frame: number }> = ({
  emotion,
  frame,
}) => {
  const blink = Math.sin(frame * 0.15) > 0.95;
  const eyeH = blink ? 1 : 4;

  switch (emotion) {
    case "happy":
      return (
        <>
          <ellipse cx="-8" cy="-5" rx="3" ry={eyeH} fill="currentColor" />
          <ellipse cx="8" cy="-5" rx="3" ry={eyeH} fill="currentColor" />
          <path
            d="M -10 5 Q 0 15 10 5"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "sad":
      return (
        <>
          <ellipse cx="-8" cy="-3" rx="3" ry={eyeH} fill="currentColor" />
          <ellipse cx="8" cy="-3" rx="3" ry={eyeH} fill="currentColor" />
          <path
            d="M -10 8 Q 0 2 10 8"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "angry":
      return (
        <>
          <line x1="-13" y1="-10" x2="-3" y2="-6" stroke="currentColor" strokeWidth="2.5" />
          <line x1="3" y1="-6" x2="13" y2="-10" stroke="currentColor" strokeWidth="2.5" />
          <ellipse cx="-8" cy="-3" rx="3" ry="4" fill="currentColor" />
          <ellipse cx="8" cy="-3" rx="3" ry="4" fill="currentColor" />
          <path
            d="M -8 8 L 0 6 L 8 8"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "shocked":
      return (
        <>
          <circle cx="-8" cy="-4" r="5" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="8" cy="-4" r="5" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="-8" cy="-4" r="2" fill="currentColor" />
          <circle cx="8" cy="-4" r="2" fill="currentColor" />
          <ellipse cx="0" cy="10" rx="6" ry="8" stroke="currentColor" fill="none" strokeWidth="2" />
        </>
      );
    case "thinking":
      return (
        <>
          <ellipse cx="-8" cy="-4" rx="3" ry={eyeH} fill="currentColor" />
          <ellipse cx="8" cy="-2" rx="3" ry={eyeH} fill="currentColor" />
          <path
            d="M -6 8 Q 0 6 8 9"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "smug":
      return (
        <>
          <line x1="-11" y1="-4" x2="-5" y2="-4" stroke="currentColor" strokeWidth="2.5" />
          <ellipse cx="8" cy="-4" rx="3" ry={eyeH} fill="currentColor" />
          <path
            d="M -6 7 Q 2 12 10 5"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "crying":
      return (
        <>
          <ellipse cx="-8" cy="-3" rx="3" ry="2" fill="currentColor" />
          <ellipse cx="8" cy="-3" rx="3" ry="2" fill="currentColor" />
          {/* Tears */}
          <line
            x1="-8"
            y1="0"
            x2="-10"
            y2={10 + Math.sin(frame * 0.3) * 4}
            stroke="#4FC3F7"
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="0"
            x2="10"
            y2={8 + Math.cos(frame * 0.3) * 4}
            stroke="#4FC3F7"
            strokeWidth="2"
          />
          <path
            d="M -10 10 Q 0 4 10 10"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "love":
      return (
        <>
          {/* Heart eyes */}
          <text x="-12" y="0" fontSize="14" fill="#FF1744">
            ♥
          </text>
          <text x="3" y="0" fontSize="14" fill="#FF1744">
            ♥
          </text>
          <path
            d="M -10 8 Q 0 16 10 8"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    default: // neutral
      return (
        <>
          <ellipse cx="-8" cy="-4" rx="3" ry={eyeH} fill="currentColor" />
          <ellipse cx="8" cy="-4" rx="3" ry={eyeH} fill="currentColor" />
          <line
            x1="-6"
            y1="7"
            x2="6"
            y2="7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
  }
};

/** Calculates limb positions based on pose and frame */
function getLimbPositions(
  pose: Pose,
  frame: number,
  offset: number
): {
  bodyEndY: number;
  leftArmEnd: [number, number];
  rightArmEnd: [number, number];
  leftLegEnd: [number, number];
  rightLegEnd: [number, number];
  headOffsetY: number;
  bodyTilt: number;
} {
  const f = frame + offset;

  const defaults = {
    bodyEndY: 70,
    leftArmEnd: [-30, 40] as [number, number],
    rightArmEnd: [30, 40] as [number, number],
    leftLegEnd: [-18, 120] as [number, number],
    rightLegEnd: [18, 120] as [number, number],
    headOffsetY: 0,
    bodyTilt: 0,
  };

  switch (pose) {
    case "walking": {
      const swing = Math.sin(f * 0.15) * 25;
      return {
        ...defaults,
        leftArmEnd: [-25 - swing * 0.5, 40 + Math.abs(swing) * 0.3],
        rightArmEnd: [25 + swing * 0.5, 40 + Math.abs(swing) * 0.3],
        leftLegEnd: [-15 + swing, 115],
        rightLegEnd: [15 - swing, 115],
        headOffsetY: Math.abs(Math.sin(f * 0.15)) * -3,
      };
    }
    case "running": {
      const swing = Math.sin(f * 0.25) * 35;
      return {
        ...defaults,
        leftArmEnd: [-30 - swing * 0.7, 30 + Math.abs(swing) * 0.4],
        rightArmEnd: [30 + swing * 0.7, 30 + Math.abs(swing) * 0.4],
        leftLegEnd: [-18 + swing, 110],
        rightLegEnd: [18 - swing, 110],
        headOffsetY: Math.abs(Math.sin(f * 0.25)) * -6,
        bodyTilt: 15,
      };
    }
    case "jumping": {
      const jumpPhase = Math.sin(f * 0.08);
      const jumpHeight = Math.max(0, jumpPhase) * 40;
      return {
        ...defaults,
        leftArmEnd: [-35, 10 - jumpHeight * 0.3],
        rightArmEnd: [35, 10 - jumpHeight * 0.3],
        leftLegEnd: [-20, 115 + (jumpPhase > 0 ? -15 : 0)],
        rightLegEnd: [20, 115 + (jumpPhase > 0 ? -15 : 0)],
        headOffsetY: -jumpHeight,
      };
    }
    case "dancing": {
      const beat = Math.sin(f * 0.2);
      const beat2 = Math.cos(f * 0.2);
      return {
        ...defaults,
        leftArmEnd: [-30 + beat * 20, 20 + beat2 * 15],
        rightArmEnd: [30 - beat * 20, 20 - beat2 * 15],
        leftLegEnd: [-15 + beat * 10, 115],
        rightLegEnd: [15 - beat * 10, 115],
        headOffsetY: beat * -5,
        bodyTilt: beat * 8,
      };
    }
    case "sitting":
      return {
        ...defaults,
        bodyEndY: 55,
        leftLegEnd: [-25, 90],
        rightLegEnd: [25, 90],
        leftArmEnd: [-25, 50],
        rightArmEnd: [25, 50],
      };
    case "facepalm":
      return {
        ...defaults,
        leftArmEnd: [-30, 40],
        rightArmEnd: [5, -15], // hand on face
      };
    case "pointing":
      return {
        ...defaults,
        leftArmEnd: [-30, 40],
        rightArmEnd: [55, 15], // pointing right
      };
    case "shrugging":
      return {
        ...defaults,
        leftArmEnd: [-40, 15],
        rightArmEnd: [40, 15],
        headOffsetY: -3,
      };
    case "waving": {
      const waveAngle = Math.sin(f * 0.3) * 15;
      return {
        ...defaults,
        leftArmEnd: [-30, 40],
        rightArmEnd: [35 + waveAngle, -10 + Math.abs(waveAngle)],
      };
    }
    case "celebrating": {
      const cel = Math.sin(f * 0.25);
      return {
        ...defaults,
        leftArmEnd: [-35 + cel * 5, -20 + cel * 10],
        rightArmEnd: [35 - cel * 5, -20 - cel * 10],
        headOffsetY: cel * -5,
        leftLegEnd: [-18 + cel * 8, 115],
        rightLegEnd: [18 - cel * 8, 115],
      };
    }
    case "falling": {
      const fallRot = Math.min(f * 0.5, 30);
      return {
        ...defaults,
        leftArmEnd: [-40, 10],
        rightArmEnd: [40, 10],
        bodyTilt: fallRot,
        headOffsetY: fallRot * 0.5,
      };
    }
    default:
      return defaults;
  }
}

export const Stickman: React.FC<StickmanProps> = ({
  x,
  y,
  emotion = "neutral",
  pose = "standing",
  color = "#FFFFFF",
  scale = 1,
  flip = false,
  label,
  animationOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const limbs = getLimbPositions(pose, frame, animationOffset);

  // Entrance animation
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const scaleX = flip ? -scale : scale;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scaleX * entrance}, ${scale * entrance})`}
      style={{ color }}
    >
      {/* Body tilt */}
      <g transform={`rotate(${limbs.bodyTilt})`}>
        {/* Head */}
        <circle
          cx="0"
          cy={-30 + limbs.headOffsetY}
          r="25"
          stroke={color}
          fill="none"
          strokeWidth="3"
        />
        {/* Face */}
        <g transform={`translate(0, ${-30 + limbs.headOffsetY})`}>
          <Face emotion={emotion} frame={frame + animationOffset} />
        </g>

        {/* Neck to body */}
        <line
          x1="0"
          y1={-5 + limbs.headOffsetY}
          x2="0"
          y2={limbs.bodyEndY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left Arm */}
        <line
          x1="0"
          y1="15"
          x2={limbs.leftArmEnd[0]}
          y2={limbs.leftArmEnd[1]}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right Arm */}
        <line
          x1="0"
          y1="15"
          x2={limbs.rightArmEnd[0]}
          y2={limbs.rightArmEnd[1]}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left Leg */}
        <line
          x1="0"
          y1={limbs.bodyEndY}
          x2={limbs.leftLegEnd[0]}
          y2={limbs.leftLegEnd[1]}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right Leg */}
        <line
          x1="0"
          y1={limbs.bodyEndY}
          x2={limbs.rightLegEnd[0]}
          y2={limbs.rightLegEnd[1]}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Character label */}
      {label && (
        <text
          x="0"
          y={limbs.leftLegEnd[1] + 25}
          textAnchor="middle"
          fill={color}
          fontSize="16"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          transform={flip ? `scale(-1, 1)` : ""}
        >
          {label}
        </text>
      )}
    </g>
  );
};
