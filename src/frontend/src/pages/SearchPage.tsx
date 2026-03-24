import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";
import { ArticleCard } from "../components/ArticleCard";
import { useSearchArticles } from "../hooks/useQueries";

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3"];

export function SearchPage() {
  const { q } = useSearch({ from: "/search" });
  const query = q || "";
  const { data: results = [], isLoading } = useSearchArticles(query);

  document.title = `Search: "${query}" — Insight Today`;

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="search.page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b-2 border-border pb-3 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <SearchIcon size={18} className="text-muted-foreground" />
            <h1 className="font-body font-black uppercase tracking-widest text-xl text-foreground">
              Search Results
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Searching..."
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKELETON_IDS.map((k) => (
              <Skeleton key={k} className="h-64 rounded" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20" data-ocid="search.empty_state">
            <p className="text-muted-foreground text-lg">
              No articles found for "{query}".
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Try different keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((article, i) => (
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
