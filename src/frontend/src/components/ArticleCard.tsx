import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import { CategoryBadge } from "./CategoryBadge";

function formatDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({
  article,
  index = 0,
}: { article: Article; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-card rounded overflow-hidden shadow-card hover:shadow-md transition-shadow group flex flex-col"
      data-ocid={`article.item.${index + 1}`}
    >
      <Link
        to="/article/$id"
        params={{ id: article.id.toString() }}
        className="block overflow-hidden"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={
              article.imageUrl ||
              "/assets/generated/hero-world-news.dim_1200x700.jpg"
            }
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} />
          <span className="text-xs text-muted-foreground">
            {formatDate(article.publishedDate)}
          </span>
        </div>
        <Link to="/article/$id" params={{ id: article.id.toString() }}>
          <h3 className="font-display font-bold text-base md:text-lg leading-snug mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          By {article.author}
        </div>
      </div>
    </motion.article>
  );
}
