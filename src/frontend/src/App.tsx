import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { BreakingNewsTicker } from "./components/BreakingNewsTicker";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { ArticlePage } from "./pages/ArticlePage";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreakingNewsTicker />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$categoryId",
  component: CategoryPage,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$id",
  component: ArticlePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  validateSearch: (search: Record<string, string>) => ({ q: search.q || "" }),
  component: SearchPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  categoryRoute,
  articleRoute,
  searchRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
