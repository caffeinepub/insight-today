import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ArticleCategory } from "../backend.d";
import type { Article, Comment } from "../backend.d";
import { SAMPLE_ARTICLES } from "../data/sampleArticles";
import { useActor } from "./useActor";

export function useAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return SAMPLE_ARTICLES as unknown as Article[];
      const result = await actor.getAllArticles();
      return result.length > 0
        ? result
        : (SAMPLE_ARTICLES as unknown as Article[]);
    },
    enabled: !isFetching,
  });
}

export function useArticlesByCategory(category: ArticleCategory) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["articles", "category", category],
    queryFn: async () => {
      if (!actor) {
        return (SAMPLE_ARTICLES as unknown as Article[]).filter(
          (a) => a.category === category,
        );
      }
      const result = await actor.getArticlesByCategory(category);
      return result.length > 0
        ? result
        : (SAMPLE_ARTICLES as unknown as Article[]).filter(
            (a) => a.category === category,
          );
    },
    enabled: !isFetching,
  });
}

export function useArticle(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["article", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) {
        return (
          (SAMPLE_ARTICLES as unknown as Article[]).find((a) => a.id === id) ||
          null
        );
      }
      try {
        return await actor.getArticleById(id);
      } catch {
        return (
          (SAMPLE_ARTICLES as unknown as Article[]).find((a) => a.id === id) ||
          null
        );
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useSearchArticles(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: async () => {
      if (!keyword) return [];
      if (!actor) {
        const kw = keyword.toLowerCase();
        return (SAMPLE_ARTICLES as unknown as Article[]).filter(
          (a) =>
            a.title.toLowerCase().includes(kw) ||
            a.excerpt.toLowerCase().includes(kw) ||
            a.tags.some((t) => t.toLowerCase().includes(kw)),
        );
      }
      return actor.searchArticles(keyword);
    },
    enabled: !!keyword && !isFetching,
  });
}

export function useBreakingNews() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["breakingNews"],
    queryFn: async () => {
      if (!actor)
        return "LIVE: World leaders convene emergency climate summit in Geneva — Markets respond to Fed rate cut signals — Apple unveils Vision Pro 2";
      return actor.getBreakingNews();
    },
    enabled: !isFetching,
  });
}

export function useComments(articleId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["comments", articleId?.toString()],
    queryFn: async () => {
      if (!articleId || !actor) return [] as Comment[];
      return actor.getCommentsForArticle(articleId);
    },
    enabled: !!articleId && !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNewsletterSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewsletterSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      articleId,
      author,
      text,
    }: {
      articleId: bigint;
      author: string;
      text: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addComment(articleId, author, text);
    },
    onSuccess: (_, { articleId }) => {
      qc.invalidateQueries({ queryKey: ["comments", articleId.toString()] });
    },
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.subscribeToNewsletter(email);
    },
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: Article) => {
      if (!actor) throw new Error("Not connected");
      return actor.createArticle(article);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, article }: { id: bigint; article: Article }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateArticle(id, article);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useSetBreakingNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (news: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setBreakingNews(news);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["breakingNews"] });
    },
  });
}
