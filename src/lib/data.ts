export interface Company {
  id: string;
  name: string;
  url: string;
  industry: string;
  stage: string;
  location: string;
  description: string;
  founded: number;
}

export const mockCompanies: Company[] = [
  {
    id: "c1",
    name: "Stripe",
    url: "https://stripe.com",
    industry: "Fintech",
    stage: "Public",
    location: "San Francisco, CA",
    description: "Financial infrastructure platform for the internet.",
    founded: 2010,
  },
  {
    id: "c2",
    name: "Vercel",
    url: "https://vercel.com",
    industry: "DevTools",
    stage: "Series D",
    location: "San Francisco, CA",
    description: "Frontend cloud platform for modern web frameworks.",
    founded: 2015,
  },
  {
    id: "c3",
    name: "Anthropic",
    url: "https://anthropic.com",
    industry: "AI",
    stage: "Series C",
    location: "San Francisco, CA",
    description: "AI safety and research company.",
    founded: 2021,
  },
  {
    id: "c4",
    name: "Linear",
    url: "https://linear.app",
    industry: "Productivity",
    stage: "Series B",
    location: "San Francisco, CA",
    description: "Purpose-built tool for planning and building products.",
    founded: 2019,
  },
  {
    id: "c5",
    name: "Supabase",
    url: "https://supabase.com",
    industry: "DevTools",
    stage: "Series B",
    location: "Singapore",
    description: "Open source Firebase alternative.",
    founded: 2020,
  },
  {
    id: "c6",
    name: "Rippling",
    url: "https://rippling.com",
    industry: "HR Tech",
    stage: "Series E",
    location: "San Francisco, CA",
    description: "Workforce management platform.",
    founded: 2016,
  },
  {
    id: "c7",
    name: "Hugging Face",
    url: "https://huggingface.co",
    industry: "AI",
    stage: "Series D",
    location: "New York, NY",
    description: "The AI community building the future.",
    founded: 2016,
  },
  {
    id: "c8",
    name: "Plaid",
    url: "https://plaid.com",
    industry: "Fintech",
    stage: "Series D",
    location: "San Francisco, CA",
    description: "Data network powering the fintech tools that millions rely on.",
    founded: 2013,
  },
  {
    id: "c9",
    name: "Figma",
    url: "https://figma.com",
    industry: "Design",
    stage: "Series E",
    location: "San Francisco, CA",
    description: "Collaborative interface design tool.",
    founded: 2012,
  },
  {
    id: "c10",
    name: "Notion",
    url: "https://notion.so",
    industry: "Productivity",
    stage: "Series C",
    location: "San Francisco, CA",
    description: "All-in-one workspace for your notes, tasks, wikis, and databases.",
    founded: 2013,
  }
];
