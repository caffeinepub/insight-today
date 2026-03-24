import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ArticleCategory } from "../backend.d";
import { ArticleCard } from "../components/ArticleCard";
import { useArticlesByCategory } from "../hooks/useQueries";

const CATEGORY_TITLES: Record<string, string> = {
  worldNews: "World News",
  technology: "Technology",
  finance: "Finance",
  lifestyle: "Lifestyle & Blogs",
};

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export function CategoryPage() {
  const { categoryId } = useParams({ from: "/category/$categoryId" });
  const category = categoryId as ArticleCategory;
  const { data: articles = [], isLoading } = useArticlesByCategory(category);
  const title = CATEGORY_TITLES[categoryId] || categoryId;

  document.title = `${title} — Insight Today`;

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="category.page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b-2 border-border pb-3 mb-6">
          <h1 className="font-body font-black uppercase tracking-widest text-xl text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {articles.length} stories
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKELETON_IDS.map((k) => (
              <Skeleton key={k} className="h-64 rounded" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20" data-ocid="category.empty_state">
            <p className="text-muted-foreground text-lg">
              No articles in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id.toString()}
                article={article}
                index={i}
              />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
