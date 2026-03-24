import { ArticleCategory } from "../backend.d";

export interface SampleArticle {
  id: bigint;
  title: string;
  content: string;
  isPublished: boolean;
  publishedDate: bigint;
  tags: string[];
  author: string;
  imageUrl: string;
  isFeatured: boolean;
  excerpt: string;
  category: ArticleCategory;
}

const now = BigInt(Date.now()) * 1_000_000n;
const daysAgo = (d: number) => now - BigInt(d) * 86_400_000_000_000n;

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 1n,
    title: "World Leaders Convene in Geneva for Historic Climate Summit",
    content: `Leaders from 195 nations gathered in Geneva this week for what many are calling the most consequential climate summit in a decade. The summit, hosted by the United Nations, aims to finalize binding commitments for carbon neutrality by 2045.\n\nKey negotiations center on a proposed global carbon tax and a $500 billion fund to assist developing nations transition to renewable energy. The European Union and United States have signaled support for the framework, while several major emerging economies remain cautious about economic impacts.\n\nUN Secretary-General António Guterres opened the summit with stark warnings: "The window for meaningful action is narrowing. This generation of leaders will be judged by history on what they decide in these halls."\n\nThe summit runs through Friday, with final declarations expected before close of business.`,
    isPublished: true,
    publishedDate: daysAgo(0),
    tags: ["climate", "UN", "Geneva", "world leaders"],
    author: "Elena Vasquez",
    imageUrl: "/assets/generated/hero-world-news.dim_1200x700.jpg",
    isFeatured: true,
    excerpt:
      "World leaders gather in Geneva as UN climate summit reaches critical juncture with binding emission targets on the table.",
    category: ArticleCategory.worldNews,
  },
  {
    id: 2n,
    title: "OpenAI Unveils GPT-5: A New Frontier in Artificial Intelligence",
    content: `OpenAI has announced the release of GPT-5, its most advanced language model to date, boasting unprecedented capabilities in reasoning, coding, and multimodal understanding.\n\nThe new model demonstrates a 40% improvement in benchmark performance over its predecessor and introduces real-time video analysis capabilities for the first time. CEO Sam Altman described it as "a step-change in what AI can do for society."\n\nDevelopers can access GPT-5 via the OpenAI API starting next month, with enterprise pricing expected to be significantly lower than GPT-4 due to efficiency improvements.\n\nThe announcement has sent ripples through the tech industry, with shares of companies across the AI sector fluctuating sharply.`,
    isPublished: true,
    publishedDate: daysAgo(1),
    tags: ["AI", "OpenAI", "GPT-5", "technology"],
    author: "Marcus Chen",
    imageUrl: "/assets/generated/article-tech-ai.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "OpenAI's GPT-5 sets new benchmarks in reasoning and multimodal AI, signaling a transformative shift in artificial intelligence.",
    category: ArticleCategory.technology,
  },
  {
    id: 3n,
    title: "Federal Reserve Signals Rate Cuts as Inflation Cools",
    content: `The Federal Reserve hinted at potential interest rate cuts in its latest policy meeting minutes, as inflation data continues to trend toward the central bank's 2% target.\n\nCore PCE inflation fell to 2.3% last month, its lowest reading in over three years. Fed Chair Jerome Powell noted that while progress is encouraging, the committee wants to see more consistent data before acting.\n\nMarkets responded positively, with the S&P 500 rising 1.8% on the news. Bond yields fell sharply as traders priced in two quarter-point cuts before year-end.\n\nAnalysts caution that geopolitical uncertainty and energy price volatility remain key risks to the outlook.`,
    isPublished: true,
    publishedDate: daysAgo(1),
    tags: ["Federal Reserve", "interest rates", "inflation", "economy"],
    author: "Priya Sharma",
    imageUrl: "/assets/generated/article-finance.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "The Fed signals potential rate cuts as inflation nears target, sparking a market rally across equities and bonds.",
    category: ArticleCategory.finance,
  },
  {
    id: 4n,
    title: "The Mindful Morning: 7 Habits That Transform Your Day",
    content: `Research consistently shows that how you spend your first hour awake sets the tone for the entire day. High performers from Silicon Valley to Wall Street share surprisingly similar morning rituals.\n\nHydration first: Drink 500ml of water before coffee. Your body loses significant fluids overnight and rehydration jump-starts cognitive function.\n\nMove your body: Even 10 minutes of light movement — stretching, yoga, or a brief walk — elevates cortisol in a healthy way, boosting alertness and mood.\n\nDeep work before screens: Spend 30-60 minutes on your most important task before checking email or social media. This protects your most cognitively fresh hours.\n\nGratitude journaling has been shown to reduce baseline anxiety and improve interpersonal relationships. Three specific things you're grateful for takes under two minutes.`,
    isPublished: true,
    publishedDate: daysAgo(2),
    tags: ["wellness", "productivity", "morning routine", "mindfulness"],
    author: "Sophia Laurent",
    imageUrl: "/assets/generated/article-lifestyle.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "Science-backed morning habits that top performers swear by — and how you can implement them starting tomorrow.",
    category: ArticleCategory.lifestyle,
  },
  {
    id: 5n,
    title: "G7 Nations Reach Agreement on Global Minimum Corporate Tax",
    content: `After years of negotiations, G7 finance ministers have signed a landmark agreement to implement a global minimum corporate tax rate of 15%, a move expected to raise hundreds of billions in annual tax revenue worldwide.\n\nThe agreement, brokered through the OECD, targets large multinationals that have historically shifted profits to low-tax jurisdictions. It comes into effect for fiscal year 2026.\n\nIreland, Luxembourg, and several other EU members — long known as corporate tax havens — have agreed to implement the rules after securing certain carve-outs for small and medium enterprises.\n\n"This is the most significant reform of international taxation in a century," said UK Chancellor Rachel Reeves.`,
    isPublished: true,
    publishedDate: daysAgo(2),
    tags: ["G7", "corporate tax", "OECD", "international"],
    author: "James O'Brien",
    imageUrl: "/assets/generated/article-world-news.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "G7 nations finalize a historic 15% global minimum corporate tax, targeting profit-shifting by multinationals.",
    category: ArticleCategory.worldNews,
  },
  {
    id: 6n,
    title: "Apple's Vision Pro 2 Redefines Spatial Computing",
    content: `Apple has unveiled the second generation of its Vision Pro headset, featuring a dramatically slimmer form factor, improved battery life, and a new neural processing chip that delivers real-time eye-tracking and emotion-aware interfaces.\n\nAt $2,499, the device is positioned as a professional productivity tool. Early reviews highlight the significantly improved comfort over the first generation, with the headset weighing 30% less.\n\nThe new operating system, visionOS 3, introduces "spatial collaboration" — allowing multiple users in different physical locations to share a persistent virtual workspace with photorealistic avatars.\n\nApple claims over 1,000 native apps are available at launch, including major productivity suites and creative tools.`,
    isPublished: true,
    publishedDate: daysAgo(3),
    tags: ["Apple", "Vision Pro", "spatial computing", "AR"],
    author: "Marcus Chen",
    imageUrl: "/assets/generated/article-tech-mobile.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "Apple's Vision Pro 2 arrives lighter, more powerful, and more affordable — but is spatial computing finally ready for the mainstream?",
    category: ArticleCategory.technology,
  },
  {
    id: 7n,
    title: "Bitcoin Surges Past $120,000 Amid Institutional Adoption Wave",
    content: `Bitcoin has surpassed $120,000 for the first time, driven by a surge in institutional investment following approval of several new spot Bitcoin ETFs and growing corporate treasury adoption.\n\nBlackRock's iShares Bitcoin ETF recorded its highest single-day inflow of $2.1 billion, while MicroStrategy announced an additional purchase of 15,000 BTC.\n\nThe rally comes despite a broader correction in speculative crypto assets, suggesting growing bifurcation between Bitcoin as a macro asset and altcoins as risk-on speculation.\n\nAnalysts at JPMorgan have raised their year-end Bitcoin price target to $150,000, citing supply dynamics from the April halving.`,
    isPublished: true,
    publishedDate: daysAgo(3),
    tags: ["Bitcoin", "crypto", "ETF", "investment"],
    author: "Priya Sharma",
    imageUrl: "/assets/generated/article-finance-gold.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "Bitcoin breaks $120K as institutional demand intensifies through ETF flows and corporate treasury adoption.",
    category: ArticleCategory.finance,
  },
  {
    id: 8n,
    title:
      "Hidden Gems: The World's Most Underrated Travel Destinations for 2026",
    content: `Overtourism has reached a crisis point in places like Barcelona, Amsterdam, and Kyoto. But for every overcrowded hotspot, there are dozens of extraordinary destinations quietly waiting to be discovered.\n\nGeorgia (the country): Tbilisi's atmospheric old town, world-class wine culture in Kakheti, and spectacular Caucasus mountain trekking rival any European destination at a fraction of the cost.\n\nOman: Beyond Dubai's glitter lies this ancient sultanate of sculpted deserts, dramatic fjords, and some of the world's most unspoiled dive sites.\n\nSlovenia: Europe's best-kept secret — Ljubljana is perhaps the continent's most livable capital city, and Lake Bled belongs in another dimension of beauty.\n\nNorwayhas overtaken Portugal as our editors' top pick for value and scenery in 2026.`,
    isPublished: true,
    publishedDate: daysAgo(4),
    tags: ["travel", "destinations", "2026", "adventure"],
    author: "Sophia Laurent",
    imageUrl: "/assets/generated/article-lifestyle-wellness.dim_800x500.jpg",
    isFeatured: false,
    excerpt:
      "Escape overtourism with our curated guide to the world's most rewarding and underexplored travel destinations for 2026.",
    category: ArticleCategory.lifestyle,
  },
];
