import { X, Zap } from "lucide-react";
import { useState } from "react";
import { useBreakingNews } from "../hooks/useQueries";

export function BreakingNewsTicker() {
  const [dismissed, setDismissed] = useState(false);
  const { data: news } = useBreakingNews();

  if (dismissed || !news) return null;

  return (
    <div
      className="bg-primary text-primary-foreground flex items-center overflow-hidden"
      data-ocid="breaking_news.panel"
    >
      <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 px-3 py-2 text-xs font-black uppercase tracking-widest whitespace-nowrap">
        <Zap size={12} className="fill-current" />
        Breaking
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker whitespace-nowrap text-xs font-medium py-2 px-4">
          {news}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-2 hover:bg-white/20 transition-colors"
        aria-label="Dismiss breaking news"
        data-ocid="breaking_news.close_button"
      >
        <X size={14} />
      </button>
    </div>
  );
}
