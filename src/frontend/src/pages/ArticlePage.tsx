import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Send, Tag, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryBadge } from "../components/CategoryBadge";
import { useAddComment, useArticle, useComments } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function formatCommentDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SKELETON_IDS = ["sk-a", "sk-b", "sk-c"];

export function ArticlePage() {
  const { id } = useParams({ from: "/article/$id" });
  const articleId = BigInt(id);
  const { data: article, isLoading } = useArticle(articleId);
  const { data: comments = [] } = useComments(article ? articleId : undefined);
  const addComment = useAddComment();

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  if (article) {
    document.title = `${article.title} — Insight Today`;
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      toast.error("Please enter your name and comment.");
      return;
    }
    try {
      await addComment.mutateAsync({
        articleId,
        author: commentAuthor,
        text: commentText,
      });
      setCommentAuthor("");
      setCommentText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 w-full mb-6 rounded" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        {SKELETON_IDS.map((k) => (
          <Skeleton key={k} className="h-4 w-full mb-2" />
        ))}
      </main>
    );
  }

  if (!article) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="article.error_state"
      >
        <h1 className="font-display text-2xl mb-4">Article Not Found</h1>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main
      className="container mx-auto px-4 py-8 max-w-4xl"
      data-ocid="article.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          data-ocid="article.link"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="aspect-[16/7] rounded overflow-hidden mb-6">
          <img
            src={
              article.imageUrl ||
              "/assets/generated/hero-world-news.dim_1200x700.jpg"
            }
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <CategoryBadge category={article.category} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} /> {formatDate(article.publishedDate)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User size={12} /> {article.author}
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl md:text-4xl leading-tight mb-4 text-foreground">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-4 italic">
          {article.excerpt}
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-display mb-8">
          {article.content.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 40)}
              className="mb-4 text-foreground leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-10 pt-6 border-t border-border">
            <Tag size={14} className="text-muted-foreground" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <section className="mt-8" data-ocid="comments.section">
          <h2 className="font-body font-black uppercase tracking-widest text-sm border-b-2 border-border pb-2 mb-6">
            Comments ({comments.length})
          </h2>

          <form
            onSubmit={handleSubmitComment}
            className="bg-card rounded p-4 shadow-card mb-6"
            data-ocid="comment.panel"
          >
            <h3 className="font-semibold text-sm mb-3">Leave a Comment</h3>
            <Input
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Your name"
              className="mb-3"
              data-ocid="comment.input"
            />
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="mb-3"
              data-ocid="comment.textarea"
            />
            <Button
              type="submit"
              disabled={addComment.isPending}
              className="flex items-center gap-2"
              data-ocid="comment.submit_button"
            >
              <Send size={14} />
              {addComment.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          {comments.length === 0 ? (
            <p
              className="text-muted-foreground text-sm"
              data-ocid="comments.empty_state"
            >
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, i) => (
                <div
                  key={`${comment.author}-${comment.timestamp}`}
                  className="bg-card rounded p-4 shadow-card"
                  data-ocid={`comment.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatCommentDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </main>
  );
}
