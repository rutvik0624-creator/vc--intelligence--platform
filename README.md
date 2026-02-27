# VC Intelligence Platform

A thesis-driven startup discovery platform for venture capital investors. This application functions as an internal tool to discover companies, enrich their data using AI, and organize them into lists.

## Features

- **Discovery Directory (`/companies`)**: Searchable table of companies with filters (industry, stage, location), sortable columns, and pagination.
- **Company Profiles (`/companies/[id]`)**: Detailed company overview, internal notes section, and a "Live Enrich" feature.
- **Live Enrichment**: Fetches public website content, extracts readable text, and uses Google's Gemini AI to parse and return structured intelligence (summary, key value propositions, market signals, and keywords).
- **List Management (`/lists`)**: Create custom lists, add/remove companies, and export lists to JSON or CSV.
- **Saved Searches (`/saved`)**: Save complex discovery queries and re-run them with a single click.

## Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS v4, Lucide Icons
- **Backend**: Express.js, Vite (Middleware Mode)
- **AI**: Google GenAI SDK (`@google/genai`)
- **Data Persistence**: LocalStorage (Client-side state)

## Setup Instructions

### Prerequisites

- Node.js (v22+ recommended)
- A Google Gemini API Key

### Environment Variables

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Architecture Notes

- **Server-Side Enrichment**: The `/api/enrich` endpoint runs entirely on the server to ensure API keys are never exposed to the frontend. It uses `cheerio` to extract text from the target company's website and sends it to the Gemini model for structured parsing.
- **Caching**: Enrichment results are cached in-memory on the server to prevent redundant API calls and improve performance.
- **State Management**: Custom React hooks (`useAppStore` and `useLocalStorage`) manage the user's lists, saved searches, and internal notes, persisting them across sessions.
