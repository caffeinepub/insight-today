import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ArticleCategory = {
    #worldNews;
    #technology;
    #finance;
    #lifestyle;
  };

  public type Article = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    category : ArticleCategory;
    tags : [Text];
    author : Text;
    publishedDate : Time.Time;
    imageUrl : Text;
    isPublished : Bool;
    isFeatured : Bool;
  };

  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  public type Comment = {
    articleId : Nat;
    author : Text;
    text : Text;
    timestamp : Time.Time;
  };

  module Comment {
    public func compare(c1 : Comment, c2 : Comment) : Order.Order {
      Int.compare(c1.timestamp, c2.timestamp);
    };
  };

  public type NewsletterSubscription = {
    email : Text;
    subscribedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextArticleId = 0;
  let articles = Map.empty<Nat, Article>();
  let comments = Map.empty<Nat, List.List<Comment>>();
  let newsletterSubscribers = List.empty<NewsletterSubscription>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var breakingNews : Text = "";

  // Bumped to 2 to force admin slot reset on this upgrade
  stable var adminResetVersion : Nat = 0;
  let CURRENT_RESET_VERSION : Nat = 2;

  stable var firstAdminClaimed : Bool = false;
  stable var storedAdminPrincipal : ?Principal = null;

  system func postupgrade() {
    if (adminResetVersion < CURRENT_RESET_VERSION) {
      storedAdminPrincipal := null;
      firstAdminClaimed := false;
      adminResetVersion := CURRENT_RESET_VERSION;
    };
  };

  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (storedAdminPrincipal) {
      case (null) {
        storedAdminPrincipal := ?caller;
        firstAdminClaimed := true;
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
        return true;
      };
      case (?adminPrincipal) {
        if (caller == adminPrincipal) {
          AccessControl.assignRole(accessControlState, caller, caller, #admin);
          return true;
        };
        return false;
      };
    };
  };

  public shared ({ caller }) func registerUser() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (AccessControl.hasPermission(accessControlState, caller, #user)) { return true };
    AccessControl.assignRole(accessControlState, caller, caller, #user);
    true;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getArticleById(id : Nat) : async Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query ({ caller }) func getAllArticles() : async [Article] {
    articles.values().toArray().sort();
  };

  public query ({ caller }) func searchArticles(keyword : Text) : async [Article] {
    let lowerKeyword = keyword.toLower();
    articles.values().toArray().filter(
      func(article) {
        article.title.toLower().contains(#text lowerKeyword) or article.excerpt.toLower().contains(#text lowerKeyword);
      }
    );
  };

  public query ({ caller }) func getArticlesByCategory(category : ArticleCategory) : async [Article] {
    articles.values().toArray().filter(
      func(article) { article.category == category }
    );
  };

  public shared ({ caller }) func createArticle(article : Article) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };
    let id = nextArticleId;
    let newArticle : Article = { article with id; publishedDate = Time.now() };
    articles.add(id, newArticle);
    nextArticleId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(id : Nat, article : Article) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    ignore getArticleById(id);
    articles.add(id, { article with id });
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    ignore getArticleById(id);
    articles.remove(id);
    comments.remove(id);
  };

  public shared ({ caller }) func addComment(articleId : Nat, author : Text, text : Text) : async () {
    ignore getArticleById(articleId);
    let newComment : Comment = { articleId; author; text; timestamp = Time.now() };
    switch (comments.get(articleId)) {
      case (null) {
        let newList = List.empty<Comment>();
        newList.add(newComment);
        comments.add(articleId, newList);
      };
      case (?existingList) { existingList.add(newComment) };
    };
  };

  public query ({ caller }) func getCommentsForArticle(articleId : Nat) : async [Comment] {
    switch (comments.get(articleId)) {
      case (null) { [] };
      case (?commentList) { commentList.toArray().sort() };
    };
  };

  public shared ({ caller }) func subscribeToNewsletter(email : Text) : async () {
    let exists = newsletterSubscribers.any(func(s) { s.email == email });
    if (exists) { Runtime.trap("Email already subscribed to the newsletter") };
    newsletterSubscribers.add({ email; subscribedAt = Time.now() });
  };

  public query ({ caller }) func getNewsletterSubscribers() : async [NewsletterSubscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view newsletter subscribers");
    };
    newsletterSubscribers.values().toArray();
  };

  public query ({ caller }) func getBreakingNews() : async Text { breakingNews };

  public shared ({ caller }) func setBreakingNews(news : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set breaking news");
    };
    breakingNews := news;
  };
};
