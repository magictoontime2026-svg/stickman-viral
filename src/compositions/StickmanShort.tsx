/**
 * StickmanShort.tsx — Main Remotion composition
 *
 * Takes an Episode JSON and renders it as a YouTube Short (9:16, 1080x1920)
 * or landscape (16:9, 1920x1080) video.
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Stickman } from "../components/Stickman";
import { SpeechBubble } from "../components/SpeechBubble";
import { TextOverlay } from "../components/TextOverlay";
import { Background } from "../components/Background";
import {
  ScreenFlash,
  EmojiRain,
  ScreenShake,
  ZoomPulse,
  ProgressBar,
  FloatingScore,
} from "../components/Effects";
import type { Episode, Beat } from "../scenes/types";

export interface StickmanShortProps {
  episode: Episode;
}

const BeatRenderer: React.FC<{
  beat: Beat;
  episode: Episode;
}> = ({ beat, episode }) => {
  const { width, height } = useVideoConfig();

  // Build character lookup
  const charMap = useMemo(() => {
    const map = new Map<string, (typeof episode.characters)[0]>();
    for (const c of episode.characters) {
      map.set(c.id, c);
    }
    return map;
  }, [episode.characters]);

  // Wrap content in effects
  let content = (
    <AbsoluteFill>
      {/* Background */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute" }}
      >
        <Background
          scene={beat.background}
          accentColor={episode.accentColor}
        />

        {/* Characters */}
        {beat.characters.map((char) => {
          const charDef = charMap.get(char.id);
          return (
            <Stickman
              key={char.id}
              x={char.x}
              y={char.y}
              emotion={char.emotion}
              pose={char.pose}
              color={charDef?.color ?? "#FFFFFF"}
              scale={charDef?.scale ?? 1}
              flip={char.flip}
              label={charDef?.label}
            />
          );
        })}

        {/* Speech bubbles */}
        {beat.dialogs.map((dialog, i) => {
          const char = beat.characters.find((c) => c.id === dialog.characterId);
          if (!char) return null;

          // Position bubble above character
          const bubbleX = char.x;
          const bubbleY = char.y - 120;
          const tailDir = char.x < width / 2 ? "left" : "right";

          return (
            <SpeechBubble
              key={i}
              text={dialog.text}
              x={bubbleX}
              y={bubbleY - i * 80}
              style={dialog.style}
              tailDirection="down"
              enterFrame={dialog.delayFrames}
              emoji={dialog.emoji}
            />
          );
        })}
      </svg>

      {/* Text overlays (rendered as HTML for better text rendering) */}
      {beat.textOverlays.map((overlay, i) => (
        <TextOverlay
          key={i}
          text={overlay.text}
          position={overlay.position}
          animation={overlay.animation}
          enterFrame={overlay.enterFrame}
          exitFrame={overlay.exitFrame}
          emoji={overlay.emoji}
          subtext={overlay.subtext}
          fontSize={overlay.fontSize}
          color={overlay.color}
        />
      ))}

      {/* Effects */}
      {beat.effects.map((effect, i) => {
        switch (effect.type) {
          case "screenFlash":
            return (
              <ScreenFlash
                key={i}
                triggerFrame={effect.triggerFrame}
                color={effect.params.color as string}
                duration={effect.params.duration as number}
              />
            );
          case "emojiRain":
            return (
              <EmojiRain
                key={i}
                emoji={effect.params.emoji as string ?? "🔥"}
                enterFrame={effect.triggerFrame}
                count={effect.params.count as number}
                duration={effect.params.duration as number}
              />
            );
          case "floatingScore":
            return (
              <FloatingScore
                key={i}
                text={effect.params.text as string ?? "+1"}
                x={effect.params.x as number ?? width / 2}
                y={effect.params.y as number ?? height / 2}
                triggerFrame={effect.triggerFrame}
                color={effect.params.color as string}
              />
            );
          case "progressBar":
            return (
              <ProgressBar
                key={i}
                enterFrame={effect.triggerFrame}
                duration={effect.params.duration as number ?? 60}
                label={effect.params.label as string}
                color={effect.params.color as string}
              />
            );
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );

  // Wrap in screen shake / zoom effects
  for (const effect of beat.effects) {
    if (effect.type === "screenShake") {
      content = (
        <ScreenShake
          triggerFrame={effect.triggerFrame}
          intensity={effect.params.intensity as number}
          duration={effect.params.duration as number}
        >
          {content}
        </ScreenShake>
      );
    } else if (effect.type === "zoomPulse") {
      content = (
        <ZoomPulse
          triggerFrame={effect.triggerFrame}
          scale={effect.params.scale as number}
          duration={effect.params.duration as number}
        >
          {content}
        </ZoomPulse>
      );
    }
  }

  return content;
};

export const StickmanShort: React.FC<StickmanShortProps> = ({ episode }) => {
  // Calculate frame offsets for each beat
  const beatOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    for (const beat of episode.beats) {
      offsets.push(total);
      total += beat.durationFrames;
    }
    return offsets;
  }, [episode.beats]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("generated-background-music.wav")} volume={0.3} />
      {episode.beats.map((beat, i) => (
        <Sequence
          key={i}
          from={beatOffsets[i]}
          durationInFrames={beat.durationFrames}
        >
          <BeatRenderer beat={beat} episode={episode} />
        </Sequence>
      ))}

      {/* Watermark / channel branding */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          fontSize: 14,
          color: "rgba(255,255,255,0.2)",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        @STICKMANVIBES
      </div>
    </AbsoluteFill>
  );
};
