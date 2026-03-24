import { ArticleCategory } from "../backend.d";

const LABELS: Record<ArticleCategory, string> = {
  [ArticleCategory.worldNews]: "World News",
  [ArticleCategory.technology]: "Technology",
  [ArticleCategory.finance]: "Finance",
  [ArticleCategory.lifestyle]: "Lifestyle",
};

const STYLES: Record<ArticleCategory, string> = {
  [ArticleCategory.worldNews]: "bg-blue-600 text-white",
  [ArticleCategory.technology]: "bg-purple-600 text-white",
  [ArticleCategory.finance]: "bg-emerald-600 text-white",
  [ArticleCategory.lifestyle]: "bg-rose-500 text-white",
};

export function CategoryBadge({ category }: { category: ArticleCategory }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${STYLES[category]}`}
    >
      {LABELS[category]}
    </span>
  );
}

export { LABELS as CATEGORY_LABELS };
