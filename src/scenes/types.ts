/**
 * Scene Schema — Defines the structure of a stickman episode
 *
 * This is the contract between the AI script generator and the Remotion renderer.
 * The AI outputs JSON matching this schema, and the renderer turns it into video.
 */

import { z } from "zod";
import type { Emotion, Pose } from "../components/Stickman";
import type { BubbleStyle } from "../components/SpeechBubble";
import type { TextAnimation, TextPosition } from "../components/TextOverlay";
import type { SceneType } from "../components/Background";

export const CharacterSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  color: z.string().default("#FFFFFF"),
  scale: z.number().default(1),
});

export const BeatSchema = z.object({
  /** Duration of this beat in frames (at 30fps) */
  durationFrames: z.number().min(10).max(300),

  /** Background scene for this beat */
  background: z
    .enum([
      "void", "office", "street", "home", "school",
      "stage", "gym", "park", "gradient", "matrix",
    ] as const)
    .default("void"),

  /** Characters in this beat */
  characters: z.array(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      emotion: z
        .enum([
          "neutral", "happy", "sad", "angry", "shocked",
          "thinking", "smug", "crying", "love",
        ] as const)
        .default("neutral"),
      pose: z
        .enum([
          "standing", "walking", "sitting", "jumping", "dancing",
          "facepalm", "pointing", "shrugging", "waving",
          "running", "falling", "celebrating",
        ] as const)
        .default("standing"),
      flip: z.boolean().default(false),
    })
  ),

  /** Speech bubbles */
  dialogs: z
    .array(
      z.object({
        characterId: z.string(),
        text: z.string(),
        style: z
          .enum(["speech", "thought", "shout", "whisper", "narrator"] as const)
          .default("speech"),
        delayFrames: z.number().default(0),
        emoji: z.string().optional(),
      })
    )
    .default([]),

  /** Bold text overlays */
  textOverlays: z
    .array(
      z.object({
        text: z.string(),
        position: z
          .enum(["top", "center", "bottom"] as const)
          .default("top"),
        animation: z
          .enum(["bounce", "shake", "fade", "slam", "typewriter", "none"] as const)
          .default("bounce"),
        enterFrame: z.number().default(0),
        exitFrame: z.number().optional(),
        emoji: z.string().optional(),
        subtext: z.string().optional(),
        fontSize: z.number().optional(),
        color: z.string().optional(),
      })
    )
    .default([]),

  /** Special effects */
  effects: z
    .array(
      z.object({
        type: z.enum([
          "screenFlash",
          "emojiRain",
          "screenShake",
          "zoomPulse",
          "progressBar",
          "floatingScore",
        ] as const),
        triggerFrame: z.number().default(0),
        params: z.record(z.any()).default({}),
      })
    )
    .default([]),
});

export const EpisodeSchema = z.object({
  /** Episode title (used in YouTube title) */
  title: z.string(),

  /** Short description */
  description: z.string(),

  /** YouTube tags */
  tags: z.array(z.string()),

  /** Hashtags for Shorts */
  hashtags: z.array(z.string()),

  /** Characters in the episode */
  characters: z.array(CharacterSchema),

  /** Sequence of beats (scenes) */
  beats: z.array(BeatSchema).min(2).max(12),

  /** Video format */
  format: z
    .enum(["shorts", "landscape"] as const)
    .default("shorts"),

  /** Accent color for backgrounds */
  accentColor: z.string().default("#333333"),
});

export type Character = z.infer<typeof CharacterSchema>;
export type Beat = z.infer<typeof BeatSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
