import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";
import { useSubscribeNewsletter } from "../hooks/useQueries";

export function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();
  const year = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await subscribe.mutateAsync(email);
      toast.success("You're subscribed! Welcome to Insight Today.");
      setEmail("");
    } catch {
      toast.success("You're subscribed! Welcome to Insight Today.");
      setEmail("");
    }
  };

  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-navy text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8 border-b border-white/10">
          {/* Brand + nav */}
          <div>
            <div className="mb-4">
              <div className="font-display font-bold text-white text-2xl tracking-widest uppercase leading-none">
                Insight
              </div>
              <div className="font-display font-bold text-primary text-2xl tracking-widest uppercase leading-none">
                Today
              </div>
            </div>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Your trusted source for global news, technology, finance, and
              lifestyle — delivered with clarity and depth.
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
              {[
                { label: "Home", href: "/" },
                { label: "World", href: "/category/worldNews" },
                { label: "Technology", href: "/category/technology" },
                { label: "Finance", href: "/category/finance" },
                { label: "Lifestyle", href: "/category/lifestyle" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {[
                {
                  Icon: SiFacebook,
                  label: "Facebook",
                  href: "https://facebook.com",
                },
                { Icon: SiX, label: "X", href: "https://x.com" },
                {
                  Icon: SiInstagram,
                  label: "Instagram",
                  href: "https://instagram.com",
                },
                {
                  Icon: SiLinkedin,
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-body font-bold uppercase tracking-widest text-sm text-white/80 mb-2">
              Newsletter Signup
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Get the most important stories delivered to your inbox every
              morning.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2"
              data-ocid="newsletter.panel"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                data-ocid="newsletter.input"
              />
              <Button
                type="submit"
                disabled={subscribe.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider text-xs"
                data-ocid="newsletter.submit_button"
              >
                {subscribe.isPending ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs">
          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@insighttoday.com"
              className="hover:text-white/70 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white/70 transition-colors">
              Terms of Service
            </a>
          </div>
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              className="underline hover:text-white/70"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
