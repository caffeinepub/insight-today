import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Article } from "../backend.d";
import { ArticleCategory } from "../backend.d";
import { ArticleCard } from "./ArticleCard";

const CATEGORY_HREFS: Record<ArticleCategory, string> = {
  [ArticleCategory.worldNews]: "/category/worldNews",
  [ArticleCategory.technology]: "/category/technology",
  [ArticleCategory.finance]: "/category/finance",
  [ArticleCategory.lifestyle]: "/category/lifestyle",
};

interface SectionBlockProps {
  title: string;
  articles: Article[];
  category: ArticleCategory;
}

export function SectionBlock({ title, articles, category }: SectionBlockProps) {
  if (!articles.length) return null;

  return (
    <section className="mb-10" data-ocid={`${category}.section`}>
      <div className="flex items-center justify-between mb-4 border-b-2 border-border pb-2">
        <h2 className="font-body font-black uppercase tracking-widest text-sm text-foreground">
          {title}
        </h2>
        <Link
          to={CATEGORY_HREFS[category]}
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          data-ocid={`${category}.link`}
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 3).map((article, i) => (
          <ArticleCard
            key={article.id.toString()}
            article={article}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
