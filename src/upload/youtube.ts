/**
 * youtube.ts — YouTube Data API v3 upload client
 *
 * Handles OAuth2 authentication and video upload to YouTube.
 */

import { google, type youtube_v3 } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import type { Episode } from "../scenes/types";

export interface YouTubeConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface UploadResult {
  videoId: string;
  url: string;
  title: string;
}

/**
 * Creates an authenticated YouTube client
 */
function createYouTubeClient(config: YouTubeConfig): youtube_v3.Youtube {
  const oauth2 = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    "http://localhost:3000/oauth2callback"
  );

  oauth2.setCredentials({
    refresh_token: config.refreshToken,
  });

  return google.youtube({ version: "v3", auth: oauth2 });
}

/**
 * Uploads a video to YouTube
 */
export async function uploadToYouTube(
  videoPath: string,
  episode: Episode,
  config?: YouTubeConfig
): Promise<UploadResult> {
  const ytConfig = config ?? {
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN!,
  };

  if (!ytConfig.clientId || !ytConfig.clientSecret || !ytConfig.refreshToken) {
    throw new Error(
      "YouTube credentials not configured. Run `npm run setup-auth` first."
    );
  }

  const youtube = createYouTubeClient(ytConfig);

  // Build description with hashtags
  const description = [
    episode.description,
    "",
    episode.hashtags.join(" "),
    "",
    "---",
    "🤖 Auto-generated stickman comedy",
    "📺 New episode every day!",
    "👆 Subscribe for more!",
    "",
    episode.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" "),
  ].join("\n");

  console.log(`📤 Uploading "${episode.title}" to YouTube...`);

  const fileSize = fs.statSync(videoPath).size;
  console.log(`   File size: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: episode.title,
        description,
        tags: episode.tags,
        categoryId: process.env.YOUTUBE_CATEGORY_ID ?? "24", // Entertainment
        defaultLanguage: "en",
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
        // Shorts are auto-detected by YouTube when vertical + under 60s
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = response.data.id!;
  const url = `https://youtube.com/shorts/${videoId}`;

  console.log(`✅ Uploaded successfully!`);
  console.log(`   Video ID: ${videoId}`);
  console.log(`   URL: ${url}`);

  return {
    videoId,
    url,
    title: episode.title,
  };
}

/**
 * Sets a custom thumbnail (optional — Shorts auto-generate one)
 */
export async function setThumbnail(
  videoId: string,
  thumbnailPath: string,
  config?: YouTubeConfig
): Promise<void> {
  const ytConfig = config ?? {
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN!,
  };

  const youtube = createYouTubeClient(ytConfig);

  await youtube.thumbnails.set({
    videoId,
    media: {
      body: fs.createReadStream(thumbnailPath),
    },
  });

  console.log(`🖼️  Thumbnail set for video ${videoId}`);
}
