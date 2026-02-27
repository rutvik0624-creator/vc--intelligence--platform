import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

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

    res.json({ text: textContent });
  } catch (error) {
    console.error("Scrape error:", error);
    res.status(500).json({ error: "Failed to scrape website", details: error instanceof Error ? error.message : String(error) });
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
