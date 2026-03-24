import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface NewsletterSubscription {
    subscribedAt: Time;
    email: string;
}
export interface Comment {
    text: string;
    author: string;
    articleId: bigint;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export interface Article {
    id: bigint;
    title: string;
    content: string;
    isPublished: boolean;
    publishedDate: Time;
    tags: Array<string>;
    author: string;
    imageUrl: string;
    isFeatured: boolean;
    excerpt: string;
    category: ArticleCategory;
}
export enum ArticleCategory {
    finance = "finance",
    worldNews = "worldNews",
    technology = "technology",
    lifestyle = "lifestyle"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(articleId: bigint, author: string, text: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFirstAdmin(): Promise<boolean>;
    createArticle(article: Article): Promise<bigint>;
    deleteArticle(id: bigint): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getArticleById(id: bigint): Promise<Article>;
    getArticlesByCategory(category: ArticleCategory): Promise<Array<Article>>;
    getBreakingNews(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForArticle(articleId: bigint): Promise<Array<Comment>>;
    getNewsletterSubscribers(): Promise<Array<NewsletterSubscription>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchArticles(keyword: string): Promise<Array<Article>>;
    setBreakingNews(news: string): Promise<void>;
    subscribeToNewsletter(email: string): Promise<void>;
    updateArticle(id: bigint, article: Article): Promise<void>;
}
