import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Edit2,
  Loader2,
  Newspaper,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArticleCategory } from "../backend.d";
import type { Article } from "../backend.d";
import { CATEGORY_LABELS } from "../components/CategoryBadge";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllArticles,
  useBreakingNews,
  useCreateArticle,
  useDeleteArticle,
  useIsAdmin,
  useNewsletterSubscribers,
  useSetBreakingNews,
  useUpdateArticle,
} from "../hooks/useQueries";

const EMPTY_FORM: Omit<Article, "id"> = {
  title: "",
  content: "",
  excerpt: "",
  author: "",
  imageUrl: "",
  category: ArticleCategory.worldNews,
  tags: [],
  isPublished: false,
  isFeatured: false,
  publishedDate: BigInt(Date.now()) * 1_000_000n,
};

export function AdminPage() {
  const { identity, login, loginStatus, loginError } = useInternetIdentity();
  const { actor } = useActor();

  const isInitializing = loginStatus === "initializing";
  const isLoggingIn = loginStatus === "logging-in";
  const isLoginError = loginStatus === "loginError";
  const isLoggedIn =
    (loginStatus === "success" || loginStatus === "logging-in") && !!identity;

  const {
    data: isAdmin,
    isLoading: checkingAdmin,
    refetch: refetchAdmin,
  } = useIsAdmin();
  const { data: articles = [] } = useAllArticles();
  const { data: breakingNews = "" } = useBreakingNews();
  const { data: subscribers = [] } = useNewsletterSubscribers();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const setBreakingNews = useSetBreakingNews();

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Article, "id">>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [breakingNewsInput, setBreakingNewsInput] = useState(breakingNews);
  const [claimingAdmin, setClaimingAdmin] = useState(false);

  document.title = "Admin Panel — Insight Today";

  // Automatically try to claim first admin after login
  useEffect(() => {
    if (isLoggedIn && actor && isAdmin === false && !claimingAdmin) {
      setClaimingAdmin(true);
      actor
        .claimFirstAdmin()
        .then((claimed) => {
          if (claimed) {
            toast.success("Admin access granted! Welcome.");
            refetchAdmin();
          }
          setClaimingAdmin(false);
        })
        .catch(() => setClaimingAdmin(false));
    }
  }, [isLoggedIn, actor, isAdmin, claimingAdmin, refetchAdmin]);

  if (!isLoggedIn) {
    const buttonDisabled = isInitializing || isLoggingIn;

    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto"
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Settings className="text-primary" size={28} />
            </div>
            <h1 className="font-display text-2xl mb-2">
              Admin Access Required
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage articles, breaking news, and subscribers.
            </p>
          </div>

          <Button
            onClick={() => login()}
            disabled={buttonDisabled}
            className="mx-auto w-full max-w-[200px]"
            data-ocid="admin.primary_button"
          >
            {isInitializing && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            )}
            {isLoggingIn && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            )}
            {!isInitializing && !isLoggingIn && "Sign In"}
          </Button>

          {isLoginError && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
              data-ocid="admin.error_state"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>
                {loginError?.message || "Login failed. Please try again."}
              </span>
            </motion.div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            A popup window will open for Internet Identity authentication.
            Please allow popups for this site.
          </p>
        </motion.div>
      </main>
    );
  }

  if (checkingAdmin || claimingAdmin) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
        <p className="text-muted-foreground">
          {claimingAdmin
            ? "Setting up admin access..."
            : "Verifying admin access..."}
        </p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <h1 className="font-display text-2xl mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have admin privileges.
        </p>
      </main>
    );
  }

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setForm(EMPTY_FORM);
    setTagsInput("");
    setShowForm(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      imageUrl: article.imageUrl,
      category: article.category,
      tags: article.tags,
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
      publishedDate: article.publishedDate,
    });
    setTagsInput(article.tags.join(", "));
    setShowForm(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      ...form,
      id: editingArticle?.id || 0n,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publishedDate: BigInt(Date.now()) * 1_000_000n,
    };
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({
          id: editingArticle.id,
          article: articleData,
        });
        toast.success("Article updated successfully!");
      } else {
        await createArticle.mutateAsync(articleData);
        toast.success("Article created successfully!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save article.");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle.mutateAsync(id);
      toast.success("Article deleted.");
    } catch {
      toast.error("Failed to delete article.");
    }
  };

  const handleSetBreakingNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setBreakingNews.mutateAsync(breakingNewsInput);
      toast.success("Breaking news updated!");
    } catch {
      toast.error("Failed to update breaking news.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="admin.page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6 border-b-2 border-border pb-3">
          <h1 className="font-body font-black uppercase tracking-widest text-xl">
            Admin Panel
          </h1>
          {!showForm && (
            <Button
              onClick={handleOpenCreate}
              className="flex items-center gap-2"
              data-ocid="admin.primary_button"
            >
              <Plus size={16} /> New Article
            </Button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card rounded shadow-card p-6 mb-6"
            data-ocid="article.panel"
          >
            <h2 className="font-semibold text-lg mb-4">
              {editingArticle ? "Edit Article" : "Create Article"}
            </h2>
            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Article headline"
                    required
                    data-ocid="article.input"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={form.author}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, author: e.target.value }))
                    }
                    placeholder="Author name"
                    required
                    data-ocid="article.input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, excerpt: e.target.value }))
                  }
                  placeholder="Short summary (1-2 sentences)"
                  rows={2}
                  required
                  data-ocid="article.textarea"
                />
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Full article content..."
                  rows={8}
                  required
                  data-ocid="article.textarea"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, category: v as ArticleCategory }))
                    }
                  >
                    <SelectTrigger data-ocid="article.select">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, imageUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    data-ocid="article.input"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="news, world, politics"
                    data-ocid="article.input"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, isPublished: v }))
                    }
                    data-ocid="article.switch"
                  />
                  <Label>Published</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isFeatured}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, isFeatured: v }))
                    }
                    data-ocid="article.switch"
                  />
                  <Label>Featured</Label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={createArticle.isPending || updateArticle.isPending}
                  data-ocid="article.save_button"
                >
                  {(createArticle.isPending || updateArticle.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingArticle ? "Update Article" : "Create Article"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  data-ocid="article.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <Tabs defaultValue="articles" data-ocid="admin.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="articles" className="flex items-center gap-1.5">
              <Newspaper size={14} /> Articles
            </TabsTrigger>
            <TabsTrigger value="breaking" className="flex items-center gap-1.5">
              <Settings size={14} /> Breaking News
            </TabsTrigger>
            <TabsTrigger
              value="subscribers"
              className="flex items-center gap-1.5"
            >
              <Users size={14} /> Subscribers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" data-ocid="articles.panel">
            {articles.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="articles.empty_state"
              >
                <p className="text-muted-foreground">
                  No articles yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="bg-card rounded shadow-card overflow-hidden">
                <Table data-ocid="articles.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article, i) => (
                      <TableRow
                        key={article.id.toString()}
                        data-ocid={`articles.row.${i + 1}`}
                      >
                        <TableCell className="font-medium max-w-[280px] truncate">
                          {article.title}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {CATEGORY_LABELS[article.category]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {article.author}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${article.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {article.isPublished ? "Published" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(article)}
                              data-ocid={`articles.edit_button.${i + 1}`}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(article.id)}
                              data-ocid={`articles.delete_button.${i + 1}`}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="breaking" data-ocid="breaking.panel">
            <div className="bg-card rounded shadow-card p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Set Breaking News Ticker</h3>
              <form onSubmit={handleSetBreakingNews} className="space-y-3">
                <Textarea
                  value={breakingNewsInput}
                  onChange={(e) => setBreakingNewsInput(e.target.value)}
                  placeholder="Enter breaking news text..."
                  rows={3}
                  data-ocid="breaking.textarea"
                />
                <Button
                  type="submit"
                  disabled={setBreakingNews.isPending}
                  data-ocid="breaking.save_button"
                >
                  {setBreakingNews.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Breaking News
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="subscribers" data-ocid="subscribers.panel">
            {subscribers.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="subscribers.empty_state"
              >
                <p className="text-muted-foreground">No subscribers yet.</p>
              </div>
            ) : (
              <div className="bg-card rounded shadow-card overflow-hidden">
                <Table data-ocid="subscribers.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscribed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((sub, i) => (
                      <TableRow
                        key={sub.email}
                        data-ocid={`subscribers.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          {sub.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(
                            Number(sub.subscribedAt / 1_000_000n),
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
