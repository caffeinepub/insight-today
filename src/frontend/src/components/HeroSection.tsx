import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import { CategoryBadge } from "./CategoryBadge";

function formatDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function HeroSection({ articles }: { articles: Article[] }) {
  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const secondary = articles.filter((a) => a.id !== featured?.id).slice(0, 2);

  if (!featured) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 mb-8">
      {/* Main hero card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded overflow-hidden group"
        style={{ minHeight: "420px" }}
        data-ocid="hero.card"
      >
        <img
          src={
            featured.imageUrl ||
            "/assets/generated/hero-world-news.dim_1200x700.jpg"
          }
          alt={featured.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <CategoryBadge category={featured.category} />
          <h1 className="font-display font-bold text-2xl md:text-4xl text-white mt-2 mb-3 leading-tight">
            {featured.title}
          </h1>
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {featured.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">
              By {featured.author} · {formatDate(featured.publishedDate)}
            </span>
            <Link
              to="/article/$id"
              params={{ id: featured.id.toString() }}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity"
              data-ocid="hero.primary_button"
            >
              Read Full Story <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Side cards */}
      <div className="flex flex-col gap-4">
        {secondary.map((article, i) => (
          <motion.div
            key={article.id.toString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            className="relative rounded overflow-hidden group flex-1"
            style={{ minHeight: "190px" }}
          >
            <img
              src={
                article.imageUrl ||
                "/assets/generated/hero-world-news.dim_1200x700.jpg"
              }
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <CategoryBadge category={article.category} />
              <Link to="/article/$id" params={{ id: article.id.toString() }}>
                <h3 className="font-display font-bold text-white text-sm md:text-base mt-1 leading-snug hover:text-white/80 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
