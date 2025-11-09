import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ------------------------------
// CONFIGURATION
// ------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const OPENAI_MODEL = "gpt-4o";
const GEMINI_MODEL = "gemini-2.5-pro"; // Corrected model name
const MAX_ATTEMPTS = 2; // Safety brake for the loop
const MIN_AVAILABLE_DOMAINS = 5; // Success threshold

// ------------------------------
// STAGE 1: THE BRAND STRATEGIST (OpenAI)
// ------------------------------
async function runStrategist(industry, keywords, tone) {
  const prompt = `
    You are a world-class brand strategist from the agency Wolff Olins. Your task is to analyze a user's request and create a deep "Brand Essence" document.
    The goal is to move beyond literal descriptions and find the emotional core of the brand.

    USER REQUEST:
    - Industry: "${industry}"
    - Keywords: "${keywords}"
    - Tone: "${tone || "modern"}"

    Create a JSON object containing:
    1.  "brandStory": A short, evocative narrative (2-3 sentences).
    2.  "coreMetaphors": An array of 3 abstract, powerful metaphors.
    3.  "namingTerritories": An array of 3 distinct, creative territories to explore.

    Return ONLY the JSON object for the Brand Essence.
  `;

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const essence = JSON.parse(response.choices[0].message.content);
  console.log(
    "✅ Stage 1 Complete: Brand Essence Defined",
    JSON.stringify(essence, null, 2)
  );
  return essence;
}

// ------------------------------
// STAGE 2: THE CREATIVE LINGUISTS (Dual Model with Avoidance Logic)
// ------------------------------
async function runDualCreators(brandEssence, failedAttempts = []) {
  let avoidancePrompt = "";
  if (failedAttempts.length > 0) {
    avoidancePrompt = `
      IMPORTANT: In the previous attempt, many domains were taken. AVOID generating names that are phonetically similar to these failed attempts: ${failedAttempts.slice(0, 10).join(", ")}. Be more creative and unconventional.
    `;
  }

  const basePrompt = `
    You are a creative linguist who invents names for brands like 'Stripe', 'Notion', and 'Figma'. You are allergic to generic tech-speak.
    Based on the following Brand Essence, generate a diverse list of 25 unique, invented brand names.

    CRITICAL RULE: AVOID obvious, clunky tech portmanteaus like 'CogniVex', 'IntelliData', 'VirtuFlow'. The goal is subtlety, phonetic beauty, and emotional resonance, not a literal description.
    ${avoidancePrompt}

    BRAND ESSENCE:
    ${JSON.stringify(brandEssence, null, 2)}

    Return ONLY a newline-separated list of the 25 names. Do not number them or add any other text.
  `;

  // OpenAI Creator
  const openAICreator = openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: basePrompt }],
    temperature: 1.3,
    top_p: 0.9,
  });

  // Gemini Creator
  const geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const geminiCreator = geminiModel.generateContent(basePrompt);

  // Run in parallel
  const [openAIResponse, geminiResponse] = await Promise.all([
    openAICreator,
    geminiCreator,
  ]);

  const openAINames = (openAIResponse.choices[0].message.content || "")
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 2 && n.length < 15);
  console.log("🤖 OpenAI Creator Generated:", openAINames);

  const geminiNames = (geminiResponse.response.text() || "")
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 2 && n.length < 15);
  console.log("✨ Gemini Creator Generated:", geminiNames);

  const combined = [...new Set([...openAINames, ...geminiNames])];
  console.log(
    `✅ Stage 2 Complete: Generated ${combined.length} unique candidates.`
  );
  return combined;
}

// ------------------------------
// STAGE 3: THE RUTHLESS CRITIC (OpenAI)
// ------------------------------
async function runCritic(nameList, brandEssence) {
  const prompt = `
    You are the most discerning naming critic in the world. Your reputation is on the line. You will filter the provided list of names with extreme prejudice.

    YOUR FILTERING CRITERIA:
    1.  **Immediate Disqualification**: Throw out anything that sounds like a generic AI-generated word salad ('Cogni', 'Intelli', 'Virtu', 'Vex', 'Xara', etc.).
    2.  **Brand Essence Alignment**: Does the name *feel* like it fits the Brand Story and Metaphors?
    3.  **Phonetic Appeal & Timelessness**: Is it easy to say? Will it sound good in 10 years?

    From the list provided, select ONLY the TOP 10 strongest names. For each, provide a sharp, insightful "rationale".

    BRAND ESSENCE:
    ${JSON.stringify(brandEssence, null, 2)}

    LIST OF NAMES TO EVALUATE:
    ${nameList.join("\n")}

    Return a valid JSON object in this exact format: {"topNames": [{"name": "Auraq", "rationale": "..."}]}
  `;

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content);
  console.log(
    "✅ Stage 3 Complete: Critic has selected the Top 10.",
    JSON.stringify(result.topNames, null, 2)
  );
  return result;
}

// ------------------------------
// HELPER: DOMAIN CHECK
// ------------------------------
async function checkDomainAvailability(domain) {
  try {
    const clean = domain.toLowerCase().trim().replace(/\s+/g, "");
    const full = clean.includes(".") ? clean : `${clean}.com`;
    const res = await fetch(`https://dns.google/resolve?name=${full}&type=A`);
    const data = await res.json();
    return { domain: full, available: data.Status === 3 || !data.Answer };
  } catch {
    return { domain: `${domain}.com`, available: null };
  }
}

// ------------------------------
// MAIN API ROUTE (with Self-Correcting Loop)
// ------------------------------
export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API keys for OpenAI and Gemini are required." },
        { status: 500 }
      );
    }

    const { industry, keywords, tone } = await request.json();
    if (!industry || !keywords) {
      return NextResponse.json(
        { error: "Industry and keywords are required" },
        { status: 400 }
      );
    }

    console.log("\n\n--- Starting Self-Correcting Naming Pipeline ---");

    // Stage 1: Brand Strategy (done once)
    const essence = await runStrategist(industry, keywords, tone);

    let finalResults = [];
    let attempts = 0;
    let failedNames = [];

    // Self-correcting loop
    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      console.log(`\n>> Attempt #${attempts}...`);

      // Stages 2 & 3: Create and Critique
      const rawNames = await runDualCreators(essence, failedNames);
      if (rawNames.length < 10) {
        console.log("❌ Not enough raw names generated, trying again...");
        continue;
      }

      const criticResult = await runCritic(rawNames, essence);
      const topNames = criticResult.topNames || [];
      if (topNames.length === 0) {
        console.log("❌ Critic found no good names, trying again...");
        continue;
      }

      // Stage 4: Check Domain Availability for the batch
      console.log("✅ Stage 4: Verifying Domain Availability for Top 10...");
      const resultsWithDomains = await Promise.all(
        topNames.map(async (item) => {
          const domainCheck = await checkDomainAvailability(item.name);
          return {
            name: item.name,
            rationale: item.rationale,
            domain: domainCheck.domain,
            available: domainCheck.available,
          };
        })
      );

      const availableNames = resultsWithDomains.filter(
        (item) => item.available === true
      );
      const totalChecked = resultsWithDomains.filter(
        (item) => item.available !== null
      ).length;
      console.log(
        `🔎 Domain Results: ${availableNames.length}/${totalChecked} available out of ${topNames.length} names.`
      );

      // VALIDATION: Check if we have enough available domains
      if (availableNames.length >= MIN_AVAILABLE_DOMAINS) {
        console.log(
          `🏆 Success! Found ${availableNames.length} available domains. Exiting loop.`
        );
        finalResults = resultsWithDomains;
        break; // Exit the loop
      } else {
        console.log(
          `⚠️ Batch rejected (${availableNames.length}/${MIN_AVAILABLE_DOMAINS} available). Retrying...`
        );
        // Add the failed names to the avoidance list for the next attempt
        failedNames.push(...topNames.map((item) => item.name));
        if (attempts >= MAX_ATTEMPTS) {
          console.log(
            "❗️ Max attempts reached. Returning the best batch found so far."
          );
          finalResults = resultsWithDomains;
        }
      }
    }

    if (finalResults.length === 0) {
      throw new Error(
        "Pipeline failed to produce any results after multiple attempts."
      );
    }

    // Sort results to show available domains first
    finalResults.sort((a, b) => {
      if (a.available === true && b.available !== true) return -1;
      if (a.available !== true && b.available === true) return 1;
      return a.name.localeCompare(b.name);
    });

    console.log("🏆 Pipeline Complete. Returning final results.");
    return NextResponse.json({
      success: true,
      names: finalResults,
      brandEssence: essence,
      availableCount: finalResults.filter((n) => n.available === true).length,
    });
  } catch (error) {
    console.error("❌ API Pipeline Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate names.", details: errorMessage },
      { status: 500 }
    );
  }
}
