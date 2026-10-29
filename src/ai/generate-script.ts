/**
 * generate-script.ts — AI-powered episode generation using Gemini
 *
 * Uses Google Gemini to generate viral stickman episode scripts
 * as structured JSON matching the Episode schema.
 */

import { GoogleGenAI } from "@google/genai";
import { EpisodeSchema, type Episode } from "../scenes/types";
import { getSystemPrompt, getUserPrompt, getRandomTheme } from "./prompts";

const PREFERRED_GEMINI_MODEL = "gemini-3.8-flash";

export interface GenerateOptions {
  /** Specific theme to use (random if not provided) */
  theme?: string;
  /** Category hint */
  category?: string;
  /** Gemini API key (falls back to env) */
  apiKey?: string;
  /** Maximum number of available models to try (defaults to all) */
  maxRetries?: number;
}

async function getAvailableGeminiModels(ai: GoogleGenAI): Promise<string[]> {
  const availableModels: string[] = [];
  const models = await ai.models.list({ config: { pageSize: 100 } });

  for await (const model of models) {
    if (
      model.name?.toLowerCase().includes("gemini") &&
      model.supportedActions?.includes("generateContent")
    ) {
      availableModels.push(model.name);
    }
  }

  return availableModels.sort((left, right) => {
    const normalize = (name: string) => name.replace(/^models\//, "");
    if (normalize(left) === PREFERRED_GEMINI_MODEL) return -1;
    if (normalize(right) === PREFERRED_GEMINI_MODEL) return 1;
    return Number(right.toLowerCase().includes("flash")) - Number(left.toLowerCase().includes("flash"));
  });
}

/**
 * Generates a complete episode script using Gemini AI
 */
export async function generateEpisode(
  options: GenerateOptions = {}
): Promise<Episode> {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is required. Set it in .env or pass it as an option."
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: 120_000 }, // 2 minute timeout for large JSON generation
  });
  const availableModels = await getAvailableGeminiModels(ai);
  if (availableModels.length === 0) {
    throw new Error("No available Gemini models support content generation.");
  }
  const modelsToTry = availableModels.slice(0, options.maxRetries ?? availableModels.length);
  const failures: string[] = [];

  // Pick theme
  const { theme, category } = options.theme
    ? { theme: options.theme, category: options.category ?? "custom" }
    : getRandomTheme();

  console.log(`🎬 Generating episode for theme: "${theme}" [${category}]`);

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    const model = modelsToTry[attempt];
    try {
      console.log(`🤖 Trying Gemini model: ${model} (${attempt + 1}/${modelsToTry.length})`);
      const response = await ai.models.generateContent({
        model,
        contents: getUserPrompt(theme, category),
        config: {
          systemInstruction: getSystemPrompt(),
          temperature: 1.0, // High creativity
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      // Parse and validate
      const raw = JSON.parse(text);
      const episode = EpisodeSchema.parse(raw);

      console.log(`✅ Generated: "${episode.title}" (${episode.beats.length} beats)`);
      return episode;
    } catch (err) {
      console.error(`❌ Model ${model} failed:`, err);
      failures.push(`${model}: ${err}`);
    }
  }

  throw new Error(
    `Failed to generate a valid episode with ${modelsToTry.length} Gemini model(s): ${failures.join(" | ")}`
  );
}

/**
 * Generates multiple episodes in batch (for buffering content)
 */
export async function generateBatch(
  count: number,
  options: Omit<GenerateOptions, "theme"> = {}
): Promise<Episode[]> {
  const episodes: Episode[] = [];

  for (let i = 0; i < count; i++) {
    console.log(`\n📦 Generating episode ${i + 1}/${count}...`);
    const episode = await generateEpisode(options);
    episodes.push(episode);

    // Rate limit: wait between generations
    if (i < count - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return episodes;
}
