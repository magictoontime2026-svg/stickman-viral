/**
 * generate-episode.ts — Generates a new episode using Gemini AI
 *
 * Usage: npx tsx scripts/generate-episode.ts [theme]
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { generateEpisode } from "../src/ai/generate-script";

dotenv.config();

async function main() {
  const customTheme = process.argv[2];

  const episode = await generateEpisode({
    theme: customTheme,
  });

  // Save episode JSON
  const outputDir = path.resolve("output");
  fs.mkdirSync(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `episode-${timestamp}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(episode, null, 2));
  console.log(`\n💾 Episode saved to: ${filepath}`);

  // Also save as latest for easy rendering
  const latestPath = path.join(outputDir, "latest-episode.json");
  fs.writeFileSync(latestPath, JSON.stringify(episode, null, 2));
  console.log(`💾 Latest symlink: ${latestPath}`);

  // Print summary
  console.log("\n📋 Episode Summary:");
  console.log(`   Title: ${episode.title}`);
  console.log(`   Beats: ${episode.beats.length}`);
  const totalFrames = episode.beats.reduce((s, b) => s + b.durationFrames, 0);
  console.log(`   Duration: ${(totalFrames / 30).toFixed(1)}s (${totalFrames} frames)`);
  console.log(`   Characters: ${episode.characters.map((c) => c.id).join(", ")}`);
  console.log(`   Tags: ${episode.tags.slice(0, 5).join(", ")}...`);
}

main().catch((err) => {
  console.error("❌ Generation failed:", err);
  process.exit(1);
});
