import * as fs from "fs";
import * as path from "path";

const SAMPLE_RATE = 22_050;
const DURATION_SECONDS = 60;
const CHORD_DURATION_SECONDS = 8;
const CROSSFADE_SECONDS = 1.5;
const PROGRESSION = [
  [130.81, 164.81, 196, 246.94],
  [110, 130.81, 164.81, 196],
  [87.31, 130.81, 174.61, 220],
  [98, 146.83, 196, 246.94],
];

export function ensureBackgroundMusic(): string {
  const publicDir = path.resolve("public");
  const outputPath = path.join(publicDir, "generated-background-music.wav");
  if (fs.existsSync(outputPath)) return outputPath;

  fs.mkdirSync(publicDir, { recursive: true });

  const channelCount = 2;
  const sampleCount = SAMPLE_RATE * DURATION_SECONDS;
  const dataSize = sampleCount * channelCount * 2;
  const wav = Buffer.alloc(44 + dataSize);

  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channelCount, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * channelCount * 2, 28);
  wav.writeUInt16LE(channelCount * 2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const time = sampleIndex / SAMPLE_RATE;
    const progressionPosition =
      (time % (CHORD_DURATION_SECONDS * PROGRESSION.length)) /
      CHORD_DURATION_SECONDS;
    const chordIndex = Math.floor(progressionPosition);
    const nextChordIndex = (chordIndex + 1) % PROGRESSION.length;
    const chordTime = (progressionPosition - chordIndex) * CHORD_DURATION_SECONDS;
    const crossfadeProgress = Math.max(
      0,
      Math.min(1, (chordTime - CHORD_DURATION_SECONDS + CROSSFADE_SECONDS) / CROSSFADE_SECONDS)
    );
    const crossfade =
      crossfadeProgress * crossfadeProgress * (3 - 2 * crossfadeProgress);

    let chordSample = 0;
    for (let noteIndex = 0; noteIndex < PROGRESSION[chordIndex].length; noteIndex++) {
      const currentFrequency = PROGRESSION[chordIndex][noteIndex];
      const nextFrequency = PROGRESSION[nextChordIndex][noteIndex];
      const currentTone =
        Math.sin(2 * Math.PI * currentFrequency * time) +
        0.12 * Math.sin(4 * Math.PI * currentFrequency * time);
      const nextTone =
        Math.sin(2 * Math.PI * nextFrequency * time) +
        0.12 * Math.sin(4 * Math.PI * nextFrequency * time);
      chordSample += currentTone * (1 - crossfade) + nextTone * crossfade;
    }

    const fadeIn = Math.min(1, time / 2);
    const fadeOut = Math.min(1, (DURATION_SECONDS - time) / 3);
    const sample = Math.max(
      -1,
      Math.min(1, (chordSample / PROGRESSION[0].length) * 0.6 * fadeIn * fadeOut)
    );
    const pcmSample = Math.round(sample * 32_767);
    const byteOffset = 44 + sampleIndex * channelCount * 2;
    wav.writeInt16LE(pcmSample, byteOffset);
    wav.writeInt16LE(pcmSample, byteOffset + 2);
  }

  fs.writeFileSync(outputPath, wav);
  return outputPath;
}