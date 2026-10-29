/**
 * setup-youtube-auth.ts — Interactive YouTube OAuth2 setup
 *
 * Walk the user through getting YouTube API credentials.
 * Run once: npx tsx scripts/setup-youtube-auth.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  🔑 YouTube OAuth2 Setup");
  console.log("═══════════════════════════════════════════════\n");

  console.log("Before starting, you need to:");
  console.log("1. Go to https://console.cloud.google.com/");
  console.log("2. Create a project (or select existing)");
  console.log("3. Enable the 'YouTube Data API v3'");
  console.log("4. Go to Credentials → Create OAuth 2.0 Client ID");
  console.log("5. Application type: 'Desktop app'");
  console.log("6. Download the credentials\n");

  const clientId = await ask("Enter your Client ID: ");
  const clientSecret = await ask("Enter your Client Secret: ");

  const oauth2 = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "urn:ietf:wg:oauth:2.0:oob"
  );

  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n📋 Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("\nAuthorize the app, then paste the code below.\n");

  const code = await ask("Enter the authorization code: ");

  try {
    const { tokens } = await oauth2.getToken(code);

    if (!tokens.refresh_token) {
      console.error(
        "❌ No refresh token received. Try revoking access and running again."
      );
      process.exit(1);
    }

    // Write to .env
    const envPath = path.resolve(".env");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    // Update or add each credential
    const updates: Record<string, string> = {
      YOUTUBE_CLIENT_ID: clientId,
      YOUTUBE_CLIENT_SECRET: clientSecret,
      YOUTUBE_REFRESH_TOKEN: tokens.refresh_token,
    };

    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }

    fs.writeFileSync(envPath, envContent.trim() + "\n");

    console.log("\n✅ YouTube credentials saved to .env!");
    console.log("   You can now run 'npm run daily' to generate and upload videos.\n");
  } catch (err) {
    console.error("❌ Failed to exchange code:", err);
    process.exit(1);
  }
}

main().catch(console.error);
