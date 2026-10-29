/**
 * Background.tsx — Animated scene backgrounds
 *
 * Minimal, bold backgrounds that keep focus on the stickman
 * Black bg with colored accents is the signature viral style
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export type SceneType =
  | "void"        // Pure black
  | "office"      // Simple desk scene
  | "street"      // Road with buildings
  | "home"        // Couch/TV setup
  | "school"      // Classroom
  | "stage"       // Spotlight
  | "gym"         // Weights/bench
  | "park"        // Trees/bench
  | "gradient"    // Animated gradient bg
  | "matrix";     // Falling code (comedy)

export interface BackgroundProps {
  scene: SceneType;
  accentColor?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  scene,
  accentColor = "#333333",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height * 0.78;

  switch (scene) {
    case "office":
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          {/* Floor */}
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" />
          {/* Desk */}
          <rect x={width * 0.15} y={groundY - 80} width={width * 0.35} height="5" fill={accentColor} />
          <line x1={width * 0.2} y1={groundY - 75} x2={width * 0.2} y2={groundY} stroke={accentColor} strokeWidth="3" />
          <line x1={width * 0.45} y1={groundY - 75} x2={width * 0.45} y2={groundY} stroke={accentColor} strokeWidth="3" />
          {/* Monitor on desk */}
          <rect x={width * 0.25} y={groundY - 140} width="60" height="45" rx="3" stroke={accentColor} fill="none" strokeWidth="2" />
          <line x1={width * 0.25 + 30} y1={groundY - 95} x2={width * 0.25 + 30} y2={groundY - 80} stroke={accentColor} strokeWidth="2" />
          {/* Coffee cup */}
          <rect x={width * 0.4} y={groundY - 100} width="15" height="18" rx="2" stroke={accentColor} fill="none" strokeWidth="2" />
          {/* Steam */}
          <path
            d={`M ${width * 0.4 + 5} ${groundY - 102} Q ${width * 0.4 + 3} ${groundY - 112 + Math.sin(frame * 0.1) * 3} ${width * 0.4 + 7} ${groundY - 118}`}
            stroke={accentColor}
            fill="none"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      );

    case "street":
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          {/* Road */}
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" />
          {/* Dashed center line */}
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={i * 100 - (frame % 100)}
              y={groundY + 30}
              width="40"
              height="3"
              fill="#FFD700"
              opacity="0.6"
            />
          ))}
          {/* Buildings silhouette */}
          {[0.05, 0.2, 0.55, 0.75].map((xPct, i) => (
            <rect
              key={i}
              x={width * xPct}
              y={groundY - 120 - i * 30}
              width={width * 0.12}
              height={120 + i * 30}
              fill="#111"
              stroke={accentColor}
              strokeWidth="1"
            />
          ))}
        </g>
      );

    case "home":
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" />
          {/* Couch */}
          <rect x={width * 0.1} y={groundY - 60} width={width * 0.35} height="50" rx="8" stroke={accentColor} fill="none" strokeWidth="2" />
          <rect x={width * 0.08} y={groundY - 80} width="30" height="70" rx="8" stroke={accentColor} fill="none" strokeWidth="2" />
          <rect x={width * 0.1 + width * 0.35 - 25} y={groundY - 80} width="30" height="70" rx="8" stroke={accentColor} fill="none" strokeWidth="2" />
          {/* TV */}
          <rect x={width * 0.6} y={groundY - 160} width="120" height="80" rx="4" stroke={accentColor} fill="none" strokeWidth="2" />
          <line x1={width * 0.6 + 60} y1={groundY - 80} x2={width * 0.6 + 60} y2={groundY - 50} stroke={accentColor} strokeWidth="3" />
          {/* Screen glow */}
          <rect
            x={width * 0.6 + 5}
            y={groundY - 155}
            width="110"
            height="70"
            rx="2"
            fill={accentColor}
            opacity={0.15 + Math.sin(frame * 0.05) * 0.05}
          />
        </g>
      );

    case "stage":
      return (
        <g>
          <rect width={width} height={height} fill="#050505" />
          {/* Spotlight cone */}
          <polygon
            points={`${width / 2 - 30},0 ${width / 2 - 150},${groundY} ${width / 2 + 150},${groundY} ${width / 2 + 30},0`}
            fill="white"
            opacity={0.04 + Math.sin(frame * 0.03) * 0.01}
          />
          {/* Stage floor */}
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="3" />
          {/* Stage edge highlight */}
          <line x1="0" y1={groundY + 3} x2={width} y2={groundY + 3} stroke="#FFD700" strokeWidth="1" opacity="0.4" />
        </g>
      );

    case "gradient": {
      const hue = (frame * 0.5) % 360;
      return (
        <g>
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={`hsl(${hue}, 60%, 8%)`} />
              <stop offset="100%" stopColor={`hsl(${hue + 60}, 60%, 12%)`} />
            </linearGradient>
          </defs>
          <rect width={width} height={height} fill="url(#bgGrad)" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" opacity="0.5" />
        </g>
      );
    }

    case "matrix": {
      const cols = 30;
      return (
        <g>
          <rect width={width} height={height} fill="#000800" />
          {Array.from({ length: cols }).map((_, i) => {
            const colX = (i / cols) * width;
            const speed = 1 + (i % 5) * 0.5;
            const yOff = ((frame * speed + i * 100) % (height + 200)) - 100;
            return (
              <text
                key={i}
                x={colX}
                y={yOff}
                fill="#00FF41"
                fontSize="14"
                fontFamily="monospace"
                opacity={0.3}
              >
                {String.fromCharCode(0x30a0 + ((i * 7 + frame) % 96))}
              </text>
            );
          })}
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke="#003300" strokeWidth="1" />
        </g>
      );
    }

    case "school":
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" />
          {/* Blackboard */}
          <rect x={width * 0.15} y={groundY - 250} width={width * 0.5} height="150" rx="4" stroke={accentColor} fill="#0d1f0d" strokeWidth="3" />
          {/* Chalk text */}
          <text x={width * 0.4} y={groundY - 180} fill="#999" fontSize="18" fontFamily="monospace" textAnchor="middle">
            E = mc²
          </text>
          {/* Desk row */}
          {[0.15, 0.4, 0.65].map((xp, i) => (
            <rect key={i} x={width * xp} y={groundY - 50} width="80" height="5" fill={accentColor} />
          ))}
        </g>
      );

    case "gym":
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="2" />
          {/* Dumbbells */}
          <g transform={`translate(${width * 0.7}, ${groundY - 20})`}>
            <circle cx="-20" cy="0" r="12" stroke={accentColor} fill="none" strokeWidth="3" />
            <circle cx="20" cy="0" r="12" stroke={accentColor} fill="none" strokeWidth="3" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke={accentColor} strokeWidth="4" />
          </g>
          {/* Bench */}
          <rect x={width * 0.15} y={groundY - 35} width="120" height="10" rx="3" fill={accentColor} />
          <line x1={width * 0.15 + 15} y1={groundY - 25} x2={width * 0.15 + 15} y2={groundY} stroke={accentColor} strokeWidth="4" />
          <line x1={width * 0.15 + 105} y1={groundY - 25} x2={width * 0.15 + 105} y2={groundY} stroke={accentColor} strokeWidth="4" />
        </g>
      );

    case "park":
      return (
        <g>
          <rect width={width} height={height} fill="#060d06" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke="#1a3a1a" strokeWidth="2" />
          {/* Trees */}
          {[0.1, 0.8, 0.9].map((xp, i) => (
            <g key={i} transform={`translate(${width * xp}, ${groundY})`}>
              <line x1="0" y1="0" x2="0" y2="-60" stroke="#3a2a1a" strokeWidth="5" />
              <circle cx="0" cy="-80" r="30" fill="#0d2a0d" stroke="#1a3a1a" strokeWidth="2" />
            </g>
          ))}
          {/* Bench */}
          <rect x={width * 0.4} y={groundY - 30} width="80" height="6" rx="2" fill="#3a2a1a" />
          <line x1={width * 0.4 + 10} y1={groundY - 24} x2={width * 0.4 + 10} y2={groundY} stroke="#3a2a1a" strokeWidth="4" />
          <line x1={width * 0.4 + 70} y1={groundY - 24} x2={width * 0.4 + 70} y2={groundY} stroke="#3a2a1a" strokeWidth="4" />
        </g>
      );

    default: // void
      return (
        <g>
          <rect width={width} height={height} fill="#0a0a0a" />
          <line x1="0" y1={groundY} x2={width} y2={groundY} stroke={accentColor} strokeWidth="1" opacity="0.3" />
        </g>
      );
  }
};
