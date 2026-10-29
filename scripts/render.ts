/**
 * render.ts — Renders an episode JSON to MP4 using Remotion
 *
 * Usage: npx tsx scripts/render.ts [episode.json] [output.mp4]
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import * as path from "path";
import * as fs from "fs";
import type { Episode } from "../src/scenes/types";
import { ensureBackgroundMusic } from "./background-music";

export async function renderEpisode(
  episode: Episode,
  outputPath: string
): Promise<string> {
  console.log(`🎬 Rendering "${episode.title}"...`);
  const start = Date.now();

  // Calculate total frames
  const totalFrames = episode.beats.reduce(
    (sum, beat) => sum + beat.durationFrames,
    0
  );

  const compositionId =
    episode.format === "shorts" ? "StickmanShort" : "StickmanLandscape";

  // Bundle the Remotion project
  console.log("📦 Bundling project...");
  ensureBackgroundMusic();
  const bundled = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    webpackOverride: (config) => config,
  });

  // Select composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps: { episode },
  });

  // Override duration with calculated frames
  composition.durationInFrames = totalFrames;

  // Render
  console.log(
    `🎥 Rendering ${totalFrames} frames (${(totalFrames / 30).toFixed(1)}s) at ${composition.width}x${composition.height}...`
  );

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { episode },
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) {
        process.stdout.write(
          `\r   Progress: ${Math.round(progress * 100)}%`
        );
      }
    },
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Rendered in ${elapsed}s → ${outputPath} (${fileSize} MB)`);

  return outputPath;
}

// CLI entrypoint
async function main() {
  const episodePath = process.argv[2] ?? "output/latest-episode.json";
  const outputPath = process.argv[3] ?? "output/latest.mp4";

  if (!fs.existsSync(episodePath)) {
    console.error(`❌ Episode file not found: ${episodePath}`);
    console.error("   Run 'npm run generate' first to create an episode.");
    process.exit(1);
  }

  const episode: Episode = JSON.parse(fs.readFileSync(episodePath, "utf-8"));

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await renderEpisode(episode, outputPath);
}

main().catch((err) => {
  console.error("❌ Render failed:", err);
  process.exit(1);
});
