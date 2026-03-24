import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { ArticleCategory } from "../backend.d";
import { HeroSection } from "../components/HeroSection";
import { SectionBlock } from "../components/SectionBlock";
import { useAllArticles } from "../hooks/useQueries";

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

function setPageMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;
}

export function HomePage() {
  const { data: articles = [], isLoading } = useAllArticles();

  setPageMeta(
    "Insight Today — Global News, Technology, Finance & Lifestyle",
    "Your trusted source for global news, technology, finance, and lifestyle stories — delivered with clarity and depth.",
  );

  const byCategory = useMemo(
    () => ({
      worldNews: articles.filter(
        (a) => a.category === ArticleCategory.worldNews,
      ),
      technology: articles.filter(
        (a) => a.category === ArticleCategory.technology,
      ),
      finance: articles.filter((a) => a.category === ArticleCategory.finance),
      lifestyle: articles.filter(
        (a) => a.category === ArticleCategory.lifestyle,
      ),
    }),
    [articles],
  );

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 mb-8">
          <Skeleton className="h-[420px] rounded" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[200px] rounded flex-1" />
            <Skeleton className="h-[200px] rounded flex-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKELETON_IDS.map((k) => (
            <Skeleton key={k} className="h-64 rounded" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6" data-ocid="home.page">
      <HeroSection articles={articles} />

      <SectionBlock
        title="World News"
        articles={byCategory.worldNews}
        category={ArticleCategory.worldNews}
      />
      <SectionBlock
        title="Technology"
        articles={byCategory.technology}
        category={ArticleCategory.technology}
      />
      <SectionBlock
        title="Finance"
        articles={byCategory.finance}
        category={ArticleCategory.finance}
      />
      <SectionBlock
        title="Lifestyle & Blogs"
        articles={byCategory.lifestyle}
        category={ArticleCategory.lifestyle}
      />
    </main>
  );
}
