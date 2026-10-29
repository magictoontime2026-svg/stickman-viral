/**
 * Root.tsx — Remotion entry point
 *
 * Registers compositions and provides default props for studio preview.
 */

import React from "react";
import { Composition } from "remotion";
import { StickmanShort } from "./StickmanShort";
import type { Episode } from "../scenes/types";

// Default preview episode for Remotion Studio
const previewEpisode: Episode = {
  title: "POV: Monday Morning",
  description: "Every Monday morning be like... #shorts #stickman #relatable",
  tags: ["stickman", "animation", "comedy", "relatable", "shorts", "monday"],
  hashtags: ["#shorts", "#stickman", "#relatable", "#mondaymood", "#comedy"],
  characters: [
    { id: "protagonist", label: "Me", color: "#FFFFFF", scale: 1.2 },
    { id: "alarm", label: "Alarm", color: "#FF1744", scale: 0.9 },
  ],
  accentColor: "#333333",
  format: "shorts",
  beats: [
    {
      durationFrames: 60,
      background: "home",
      characters: [
        {
          id: "protagonist",
          x: 400,
          y: 1200,
          emotion: "happy",
          pose: "sitting",
          flip: false,
        },
      ],
      dialogs: [],
      textOverlays: [
        {
          text: "POV: Sunday Night",
          position: "top",
          animation: "bounce",
          enterFrame: 0,
          emoji: "😊",
          subtext: "life is good",
        },
      ],
      effects: [],
    },
    {
      durationFrames: 45,
      background: "home",
      characters: [
        {
          id: "protagonist",
          x: 400,
          y: 1200,
          emotion: "shocked",
          pose: "jumping",
          flip: false,
        },
        {
          id: "alarm",
          x: 700,
          y: 1250,
          emotion: "angry",
          pose: "dancing",
          flip: true,
        },
      ],
      dialogs: [
        {
          characterId: "alarm",
          text: "BEEP BEEP BEEP!!!",
          style: "shout",
          delayFrames: 5,
          emoji: "⏰",
        },
      ],
      textOverlays: [
        {
          text: "5 AM",
          position: "top",
          animation: "slam",
          enterFrame: 0,
          color: "#FF1744",
        },
      ],
      effects: [
        { type: "screenShake", triggerFrame: 5, params: { intensity: 12, duration: 20 } },
        { type: "screenFlash", triggerFrame: 3, params: { color: "#FF1744", duration: 6 } },
      ],
    },
    {
      durationFrames: 75,
      background: "office",
      characters: [
        {
          id: "protagonist",
          x: 350,
          y: 1200,
          emotion: "sad",
          pose: "walking",
          flip: false,
        },
      ],
      dialogs: [
        {
          characterId: "protagonist",
          text: "why do I exist",
          style: "thought",
          delayFrames: 15,
        },
      ],
      textOverlays: [
        {
          text: "Monday Morning",
          position: "top",
          animation: "fade",
          enterFrame: 0,
          exitFrame: 60,
          emoji: "💀",
          subtext: "existence is pain",
        },
      ],
      effects: [
        { type: "emojiRain", triggerFrame: 20, params: { emoji: "💀", count: 10, duration: 50 } },
      ],
    },
    {
      durationFrames: 50,
      background: "office",
      characters: [
        {
          id: "protagonist",
          x: 450,
          y: 1200,
          emotion: "crying",
          pose: "facepalm",
          flip: false,
        },
      ],
      dialogs: [
        {
          characterId: "protagonist",
          text: "Only 4 more days to go...",
          style: "whisper",
          delayFrames: 10,
        },
      ],
      textOverlays: [
        {
          text: "FOLLOW FOR PART 2",
          position: "bottom",
          animation: "bounce",
          enterFrame: 25,
          color: "#FFD700",
        },
      ],
      effects: [],
    },
  ],
};

// Calculate total duration
function getTotalFrames(ep: Episode): number {
  return ep.beats.reduce((sum, beat) => sum + beat.durationFrames, 0);
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* YouTube Shorts format: 9:16 */}
      <Composition
        id="StickmanShort"
        component={StickmanShort}
        durationInFrames={getTotalFrames(previewEpisode)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ episode: previewEpisode }}
      />

      {/* Landscape format: 16:9 */}
      <Composition
        id="StickmanLandscape"
        component={StickmanShort}
        durationInFrames={getTotalFrames(previewEpisode)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ episode: previewEpisode }}
      />
    </>
  );
};
