/**
 * prompts.ts — Viral content generation prompts
 *
 * Contains the master prompt that turns Gemini into a viral stickman
 * comedy writer, plus content theme templates.
 */

/** Content categories with virality-optimized themes */
export const VIRAL_THEMES = [
  // ---- RELATABLE DAILY LIFE ----
  {
    category: "daily_life",
    themes: [
      "Monday morning alarm goes off",
      "When you realize it's only Tuesday",
      "Friday afternoon vs Monday morning energy",
      "Setting 47 alarms and still being late",
      "Saying 'I'll sleep early tonight' at 3am",
      "When your phone is at 1% and you're nowhere near a charger",
      "Opening the fridge 100 times expecting new food to appear",
      "When the WiFi drops for 0.5 seconds",
      "When you wave back at someone who wasn't waving at you",
      "Telling yourself 'just 5 more minutes' of scrolling",
    ],
  },
  // ---- WORK/OFFICE ----
  {
    category: "work",
    themes: [
      "When the boss says 'quick meeting'",
      "Email that says 'per my last email'",
      "Working from home expectations vs reality",
      "When someone says 'we need to talk' at work",
      "Pretending to type when the boss walks by",
      "The difference between the interview and the actual job",
      "When your coworker takes credit for your work",
      "Friday 4:59 PM vs Monday 9:01 AM",
      "When the meeting could have been an email",
      "Trying to look busy when you have nothing to do",
    ],
  },
  // ---- SCHOOL/STUDY ----
  {
    category: "school",
    themes: [
      "When the teacher says 'the test will be easy'",
      "Studying for 5 minutes and rewarding yourself for 5 hours",
      "The group project where you do all the work",
      "When the teacher asks 'any questions' and it's all questions",
      "Night before the exam vs night before a normal day",
      "When someone says they 'didn't study' and gets an A",
      "Opening the textbook the night before finals",
      "When the teacher makes eye contact during a question",
      "The difference between page 1 and page 50 of your notes",
      "Summer break ending countdown",
    ],
  },
  // ---- RELATIONSHIPS/SOCIAL ----
  {
    category: "social",
    themes: [
      "Introverts at a party",
      "When your friend says 'I'll be there in 5 minutes'",
      "Practicing an argument in the shower",
      "When someone reads your message and doesn't reply",
      "Types of people at a group dinner",
      "When your friend cancels plans and you're secretly happy",
      "Overthinking a text for 45 minutes",
      "When someone says 'we should hang out' but never follows up",
      "Extrovert adopting an introvert",
      "Trying to take a group photo",
    ],
  },
  // ---- GAMING/INTERNET ----
  {
    category: "gaming",
    themes: [
      "When you die right before saving",
      "Rage quitting then immediately reopening the game",
      "Noob vs Pro differences",
      "When the cutscene is unskippable",
      "Explaining your hobby to your parents",
      "When the game says 'easy mode' but it's impossible",
      "Online gaming with lag vs without lag",
      "When you accidentally press the wrong button in a boss fight",
      "The loading screen that takes forever",
      "Gaming at 3 AM be like",
    ],
  },
  // ---- FOOD ----
  {
    category: "food",
    themes: [
      "When the food at the restaurant looks nothing like the menu",
      "Cooking at home vs what you expected",
      "When someone eats the food you were saving",
      "The stages of being hungry",
      "When the delivery says '5 minutes' for 45 minutes",
      "Trying to eat healthy for one day",
      "When you say 'I'm not hungry' then eat everything",
      "Microwave timing: 1:00 is fine but 0:59 is too long to wait",
    ],
  },
  // ---- GYM/FITNESS ----
  {
    category: "fitness",
    themes: [
      "Day 1 at the gym vs Day 2 at the gym",
      "When someone asks 'do you even lift'",
      "Gym motivation at midnight vs 6 AM",
      "New year resolution gym in January vs February",
      "When you see yourself in the gym mirror",
      "Leg day aftermath",
      "The gym bro who gives unsolicited advice",
      "When you flex and nothing happens",
    ],
  },
  // ---- SEASONS/WEATHER ----
  {
    category: "seasonal",
    themes: [
      "Summer expectations vs reality",
      "When it rains right after you wash your car",
      "Hot weather problems",
      "When the AC stops working",
      "Snow day excitement as a kid vs as an adult",
      "Spring allergies be like",
    ],
  },
  // ---- MONEY ----
  {
    category: "money",
    themes: [
      "Payday vs the day after payday",
      "When you check your bank account after the weekend",
      "Impulse buying then regretting it",
      "When someone asks you to split the bill evenly but you only had water",
      "Shopping cart online vs at checkout",
      "Telling yourself 'I deserve this' before every purchase",
    ],
  },
  // ---- EXPECTATIONS VS REALITY ----
  {
    category: "expectation_reality",
    themes: [
      "How I think I look vs how I actually look",
      "What I planned today vs what I actually did",
      "How I imagine conversations going vs reality",
      "Vacation expectations vs reality",
      "Adult life expectations vs reality",
      "DIY projects: expectation vs reality",
    ],
  },
];

/** Returns a random theme from the collection */
export function getRandomTheme(): { category: string; theme: string } {
  const categoryObj =
    VIRAL_THEMES[Math.floor(Math.random() * VIRAL_THEMES.length)];
  const theme =
    categoryObj.themes[
      Math.floor(Math.random() * categoryObj.themes.length)
    ];
  return { category: categoryObj.category, theme };
}

/** The master system prompt for Gemini */
export function getSystemPrompt(): string {
  return `You are a VIRAL STICKMAN COMEDY WRITER. Your job is to create short, punchy, extremely relatable stickman animation scripts for YouTube Shorts.

## YOUR STYLE
- Ultra short: 15-45 seconds max (450-1350 frames at 30fps)
- Setup → Punchline format. Build tension, then hit hard
- Use "POV:", "Types of:", "When you...", "Expectation vs Reality" viral formats
- Make every beat count — no filler
- Exaggerate emotions for comedy (angry becomes FURIOUS, sad becomes DEVASTATED)
- End with a twist, callback, or relatable gut punch
- Include a "Wait for it..." beat before the punchline when it makes sense

## COMEDY RULES
1. The humor comes from RELATABILITY — everyone has experienced this
2. Use contrast: calm → chaos, confidence → failure, expectation → reality
3. One-liner dialog only. Short, punchy text. NEVER more than 8 words per bubble
4. Use SHOUT bubbles for dramatic moments
5. Use THOUGHT bubbles for inner monologue comedy
6. End with something that makes people want to comment "SO TRUE" or tag a friend

## VIRAL ENGAGEMENT TACTICS
- Hook in the first 2 seconds (bold text overlay at the start)
- "Wait for it" progress bars before the punchline
- Screen shake on dramatic reveals
- Emoji rain for emphasis (🔥 💀 😭 etc.)
- End with "Follow for Part 2" or a question to drive engagement

## VIDEO FORMAT
This is a YouTube Shorts (vertical 9:16, 1080x1920). Characters should be positioned accordingly:
- Single character: center around x=540, y=1200-1400
- Two characters talking: x=300 and x=780, y=1200-1400
- Character Y position represents where their FEET are (ground is ~1500)

## OUTPUT FORMAT
You MUST output a valid JSON object matching this schema EXACTLY. No markdown fencing. No explanation. Just JSON.

The JSON must have these fields:
- title: string (YouTube title, include emoji, under 80 chars)
- description: string (YouTube description, include hashtags)
- tags: string[] (10-15 SEO tags)
- hashtags: string[] (5-7 hashtags starting with #)
- characters: array of {id, label?, color?, scale?}
- beats: array of scene beats (2-8 beats)
- accentColor: string (hex color for scene accents)
- format: "shorts"

Each beat has:
- durationFrames: number (30-180, remember 30fps)
- background: one of "void"|"office"|"street"|"home"|"school"|"stage"|"gym"|"park"|"gradient"|"matrix"
- characters: array of {id, x, y, emotion, pose, flip}
  - emotion: "neutral"|"happy"|"sad"|"angry"|"shocked"|"thinking"|"smug"|"crying"|"love"
  - pose: "standing"|"walking"|"sitting"|"jumping"|"dancing"|"facepalm"|"pointing"|"shrugging"|"waving"|"running"|"falling"|"celebrating"
- dialogs: array of {characterId, text, style, delayFrames, emoji?}
  - style: "speech"|"thought"|"shout"|"whisper"|"narrator"
- textOverlays: array of {text, position, animation, enterFrame, exitFrame?, emoji?, subtext?, fontSize?, color?}
  - position: "top"|"center"|"bottom"
  - animation: "bounce"|"shake"|"fade"|"slam"|"typewriter"|"none"
- effects: array of {type, triggerFrame, params}
  - type: "screenFlash"|"emojiRain"|"screenShake"|"zoomPulse"|"progressBar"|"floatingScore"`;
}

/** Generates the user prompt for a specific theme */
export function getUserPrompt(theme: string, category: string): string {
  return `Create a viral stickman YouTube Short about this theme:

THEME: "${theme}"
CATEGORY: ${category}

Remember:
- 15-45 seconds total (450-1350 total frames at 30fps)
- Hook viewers in the first beat with a bold text overlay
- Build to a punchline with great comedic timing
- End with engagement bait (follow CTA or relatable closer)
- Make it SO relatable that people HAVE to tag their friends

Output ONLY the JSON. No markdown. No explanation.`;
}
