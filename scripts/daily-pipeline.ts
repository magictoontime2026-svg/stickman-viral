/**
 * daily-pipeline.ts — Full daily automation pipeline
 *
 * This is the main script that runs daily (via cron/GitHub Actions).
 * It generates a new episode, renders it, uploads to YouTube, and logs everything.
 *
 * Usage: npx tsx scripts/daily-pipeline.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { generateEpisode } from "../src/ai/generate-script";
import { renderEpisode } from "./render";
import { uploadToYouTube } from "../src/upload/youtube";

dotenv.config();

interface PipelineResult {
  success: boolean;
  timestamp: string;
  episode?: {
    title: string;
    duration: number;
    beats: number;
  };
  render?: {
    outputPath: string;
    fileSizeMB: number;
    renderTimeSeconds: number;
  };
  upload?: {
    videoId: string;
    url: string;
  };
  error?: string;
}

async function runPipeline(): Promise<PipelineResult> {
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.slice(0, 10);
  const outputDir = path.resolve("output");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("═══════════════════════════════════════════════");
  console.log("  🎬 STICKMAN VIRAL FACTORY — Daily Pipeline");
  console.log(`  📅 ${dateStr}`);
  console.log("═══════════════════════════════════════════════\n");

  try {
    // ──────────────────────────────────────────────
    // STEP 1: Generate episode script with AI
    // ──────────────────────────────────────────────
    console.log("━━━ STEP 1/3: Generate Episode ━━━\n");
    const episode = await generateEpisode();

    const episodePath = path.join(outputDir, `episode-${dateStr}.json`);
    fs.writeFileSync(episodePath, JSON.stringify(episode, null, 2));
    fs.writeFileSync(
      path.join(outputDir, "latest-episode.json"),
      JSON.stringify(episode, null, 2)
    );

    const totalFrames = episode.beats.reduce(
      (s, b) => s + b.durationFrames,
      0
    );
    const durationSec = totalFrames / 30;

    console.log(`\n📋 Generated: "${episode.title}"`);
    console.log(`   Duration: ${durationSec.toFixed(1)}s | Beats: ${episode.beats.length}\n`);

    // ──────────────────────────────────────────────
    // STEP 2: Render video
    // ──────────────────────────────────────────────
    console.log("━━━ STEP 2/3: Render Video ━━━\n");
    const videoPath = path.join(outputDir, `short-${dateStr}.mp4`);
    const renderStart = Date.now();

    await renderEpisode(episode, videoPath);

    const renderTime = (Date.now() - renderStart) / 1000;
    const fileSize = fs.statSync(videoPath).size / 1024 / 1024;

    // Also copy as latest
    fs.copyFileSync(videoPath, path.join(outputDir, "latest.mp4"));

    // ──────────────────────────────────────────────
    // STEP 3: Upload to YouTube
    // ──────────────────────────────────────────────
    console.log("\n━━━ STEP 3/3: Upload to YouTube ━━━\n");

    let uploadResult;

    // Check if YouTube credentials are configured
    if (
      process.env.YOUTUBE_CLIENT_ID &&
      process.env.YOUTUBE_CLIENT_SECRET &&
      process.env.YOUTUBE_REFRESH_TOKEN
    ) {
      uploadResult = await uploadToYouTube(videoPath, episode);
    } else {
      console.log("⚠️  YouTube credentials not configured. Skipping upload.");
      console.log("   Run 'npm run setup-auth' to configure YouTube upload.");
      console.log(`   Video saved locally: ${videoPath}`);
    }

    // ──────────────────────────────────────────────
    // Done!
    // ──────────────────────────────────────────────
    const result: PipelineResult = {
      success: true,
      timestamp,
      episode: {
        title: episode.title,
        duration: durationSec,
        beats: episode.beats.length,
      },
      render: {
        outputPath: videoPath,
        fileSizeMB: Math.round(fileSize * 10) / 10,
        renderTimeSeconds: Math.round(renderTime * 10) / 10,
      },
      upload: uploadResult
        ? { videoId: uploadResult.videoId, url: uploadResult.url }
        : undefined,
    };

    console.log("\n═══════════════════════════════════════════════");
    console.log("  ✅ PIPELINE COMPLETE!");
    console.log(`  📺 ${uploadResult?.url ?? "Video saved locally"}`);
    console.log("═══════════════════════════════════════════════\n");

    return result;
  } catch (err: any) {
    console.error("\n❌ PIPELINE FAILED:", err.message);
    return {
      success: false,
      timestamp,
      error: err.message,
    };
  }
}

// Run pipeline and log results
async function main() {
  const result = await runPipeline();

  // Append to pipeline log
  const logPath = path.resolve("output/pipeline-log.jsonl");
  fs.appendFileSync(logPath, JSON.stringify(result) + "\n");
  console.log(`📝 Pipeline log: ${logPath}`);

  if (!result.success) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
