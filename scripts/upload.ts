/**
 * upload.ts — Upload the latest rendered video to YouTube
 *
 * Usage: npx tsx scripts/upload.ts [video.mp4] [episode.json]
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { uploadToYouTube } from "../src/upload/youtube";
import type { Episode } from "../src/scenes/types";

dotenv.config();

async function main() {
  const videoPath = process.argv[2] ?? "output/latest.mp4";
  const episodePath = process.argv[3] ?? "output/latest-episode.json";

  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video not found: ${videoPath}`);
    console.error("   Run 'npm run render' first.");
    process.exit(1);
  }

  if (!fs.existsSync(episodePath)) {
    console.error(`❌ Episode JSON not found: ${episodePath}`);
    process.exit(1);
  }

  const episode: Episode = JSON.parse(fs.readFileSync(episodePath, "utf-8"));

  const result = await uploadToYouTube(videoPath, episode);

  // Log the upload
  const logPath = path.resolve("output/upload-log.jsonl");
  const logEntry = {
    timestamp: new Date().toISOString(),
    videoId: result.videoId,
    url: result.url,
    title: result.title,
    episodeFile: episodePath,
  };
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n");
  console.log(`📝 Upload logged to: ${logPath}`);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
