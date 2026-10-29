# 🎬 Stickman Viral Factory

> **Fully automated YouTube Shorts pipeline** — AI writes the comedy, Remotion renders the animation, YouTube publishes it. Every. Single. Day.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Remotion](https://img.shields.io/badge/Remotion-0B84F3?logo=react&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?logo=google&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube_API-FF0000?logo=youtube&logoColor=white)

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Daily Cron (GitHub Actions)                 │
│                                                               │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │  🤖 Gemini  │──▶│  🎥 Remotion │──▶│  📤 YouTube API  │  │
│  │  AI Script  │   │  MP4 Render  │   │  Auto Upload     │  │
│  └─────────────┘   └──────────────┘   └──────────────────┘  │
│                                                               │
│  Episode JSON ──▶ React/SVG Animation ──▶ Published Short    │
└──────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Install

```bash
cd stickman-viral
npm install
```

### 2. Configure API Keys

```bash
# Copy the example env file
cp .env.example .env

# Add your Gemini API key (get one at https://aistudio.google.com/apikey)
# Edit .env and set GEMINI_API_KEY=your_key_here
```

### 3. Preview in Remotion Studio

```bash
npm run studio
```

This opens a live preview at `http://localhost:3000` where you can see the stickman animation in real-time.

### 4. Generate an Episode

```bash
# Random viral theme
npm run generate

# Or specify a theme
npm run generate "When the WiFi drops for 0.5 seconds"
```

### 5. Render to Video

```bash
npm run render
# Output: output/latest.mp4
```

### 6. Upload to YouTube

```bash
# First time: set up YouTube OAuth
npm run setup-auth

# Then upload
npm run upload
```

### 7. Full Pipeline (Generate → Render → Upload)

```bash
npm run daily
```

## ⏰ Automate Daily Uploads

### Option A: GitHub Actions (Recommended — Free)

1. Push this repo to GitHub
2. Go to **Settings → Secrets and variables → Actions**
3. Add these secrets:
   - `GEMINI_API_KEY`
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `YOUTUBE_REFRESH_TOKEN`
4. The workflow runs daily at 10:00 AM UTC automatically
5. You can also trigger it manually from the Actions tab

### Option B: Local Cron (Windows Task Scheduler)

```powershell
# Create a scheduled task to run daily at 10am
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run daily" -WorkingDirectory "C:\path\to\stickman-viral"
$trigger = New-ScheduledTaskTrigger -Daily -At 10:00am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "StickmanViralFactory" -Description "Daily stickman upload"
```

### Option C: Linux Cron

```bash
# Edit crontab
crontab -e

# Add (runs at 10am daily):
0 10 * * * cd /path/to/stickman-viral && npm run daily >> /var/log/stickman.log 2>&1
```

## 🎨 Customization

### Characters

The stickman supports **9 emotions** and **12 poses**:

| Emotions | Poses |
|---|---|
| neutral, happy, sad | standing, walking, running |
| angry, shocked, thinking | sitting, jumping, dancing |
| smug, crying, love | facepalm, pointing, shrugging |
| | waving, falling, celebrating |

### Backgrounds

10 scene types: `void`, `office`, `street`, `home`, `school`, `stage`, `gym`, `park`, `gradient`, `matrix`

### Effects

- **Screen Flash** — dramatic white/color flash
- **Emoji Rain** — falling emojis (🔥💀😭)
- **Screen Shake** — impact effect
- **Zoom Pulse** — dramatic zoom in/out
- **Progress Bar** — "Wait for it..." tension builder
- **Floating Score** — +1, "PERFECT!" popups

### Text Overlays

5 animation styles: `bounce`, `shake`, `fade`, `slam`, `typewriter`

### Speech Bubbles

5 styles: `speech`, `thought`, `shout`, `whisper`, `narrator`

## 🧠 Content Themes (80+ Pre-loaded)

The AI randomly picks from **10 viral categories**:

| Category | Example |
|---|---|
| 🏢 Work/Office | "When the meeting could've been an email" |
| 🏠 Daily Life | "Setting 47 alarms and still being late" |
| 📚 School | "The group project where you do all the work" |
| 👥 Social | "Introverts at a party" |
| 🎮 Gaming | "Rage quitting then immediately reopening the game" |
| 🍕 Food | "Opening the fridge 100 times expecting new food" |
| 💪 Fitness | "Day 1 at the gym vs Day 2 at the gym" |
| 💰 Money | "Payday vs the day after payday" |
| 🌤️ Seasonal | "When it rains right after you wash your car" |
| 🤔 Expect vs Real | "How I think I look vs how I actually look" |

## 📁 Project Structure

```
stickman-viral/
├── src/
│   ├── components/
│   │   ├── Stickman.tsx          # Main character (emotions, poses, animation)
│   │   ├── SpeechBubble.tsx      # Dialog bubbles with typing effect
│   │   ├── TextOverlay.tsx       # Bold viral text overlays
│   │   ├── Background.tsx        # 10 scene backgrounds
│   │   └── Effects.tsx           # Screen shake, emoji rain, flash, etc.
│   ├── scenes/
│   │   └── types.ts              # Episode/Beat schema (Zod validated)
│   ├── compositions/
│   │   ├── StickmanShort.tsx     # Main Remotion composition renderer
│   │   └── Root.tsx              # Remotion entry + preview episode
│   ├── ai/
│   │   ├── generate-script.ts   # Gemini AI episode generator
│   │   └── prompts.ts           # Viral comedy writing prompts & themes
│   ├── upload/
│   │   └── youtube.ts           # YouTube Data API v3 client
│   └── index.ts                 # Entry point
├── scripts/
│   ├── daily-pipeline.ts        # Full automation: generate → render → upload
│   ├── generate-episode.ts      # Standalone script generation
│   ├── render.ts                # Standalone video rendering
│   ├── upload.ts                # Standalone YouTube upload
│   └── setup-youtube-auth.ts    # Interactive OAuth setup
├── .github/workflows/
│   └── daily-upload.yml         # GitHub Actions daily cron
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```

## 🔧 Prerequisites

- **Node.js 18+**
- **Chrome/Chromium** (Remotion uses it for rendering)
- **Gemini API key** — Free at [aistudio.google.com](https://aistudio.google.com/apikey)
- **YouTube API credentials** — Via [Google Cloud Console](https://console.cloud.google.com/)

## 📈 Viral Optimization Built In

- ✅ **YouTube Shorts format** (9:16, 1080×1920) — 10x more reach than regular videos
- ✅ **Hook in first 2 seconds** — Bold text overlay grabs attention
- ✅ **"Wait for it" progress bars** — Keeps viewers watching until the end
- ✅ **Engagement CTAs** — "Follow for Part 2" drives subscriptions
- ✅ **Trending formats** — POV, Types of, Expectation vs Reality
- ✅ **Ultra-relatable humor** — 80+ pre-loaded themes people HAVE to share
- ✅ **SEO-optimized** — AI generates titles, descriptions, tags, and hashtags
- ✅ **Consistent posting** — Daily automation builds the algorithm's trust

## 📄 License

MIT — go make that bag 💰
