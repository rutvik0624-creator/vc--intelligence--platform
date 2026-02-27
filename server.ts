import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import archiver from "archiver";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for enriched companies
const enrichmentCache = new Map<string, any>();

app.get("/api/download-source", (req, res) => {
  res.attachment("vc-intel-source.zip");
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  archive.glob("**/*", {
    cwd: process.cwd(),
    ignore: ["node_modules/**", "dist/**", ".git/**", ".env", "*.zip"]
  });

  archive.finalize();
});

app.post("/api/enrich", async (req, res) => {
  try {
    const { url, companyId } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (enrichmentCache.has(companyId)) {
      return res.json(enrichmentCache.get(companyId));
    }

    // 1. Fetch website content
    let textContent = "";
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        $("script, style, noscript, iframe, img, svg").remove();
        textContent = $("body").text().replace(/\s+/g, " ").trim().substring(0, 15000); // Limit to 15k chars
      } else {
        textContent = `Could not fetch website content. Status: ${response.status}`;
      }
    } catch (e) {
      textContent = "Failed to fetch website content due to network error.";
    }

    // 2. Send to Gemini for parsing
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Analyze the following website content for a startup and extract key information for a venture capital investor.
    
Website Content:
${textContent}

If the content is empty or unreadable, do your best to infer based on the URL or provide a generic response indicating missing data.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A 1-2 sentence summary of what the company does."
            },
            descriptionBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 bullet points detailing the product, market, or key value proposition."
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5-10 keywords relevant to the company's industry, technology, and business model."
            },
            signals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-4 potential positive or negative signals for an investor (e.g., 'Strong technical team', 'Crowded market')."
            }
          },
          required: ["summary", "descriptionBullets", "keywords", "signals"]
        }
      }
    });

    const resultText = aiResponse.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const parsedResult = JSON.parse(resultText);
    
    const finalResult = {
      ...parsedResult,
      sources: [
        { url, timestamp: new Date().toISOString() }
      ]
    };

    if (companyId) {
      enrichmentCache.set(companyId, finalResult);
    }

    res.json(finalResult);
  } catch (error) {
    console.error("Enrichment error:", error);
    res.status(500).json({ error: "Failed to enrich company data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
