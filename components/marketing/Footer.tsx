import Link from "next/link";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com/opencamp", icon: GithubIcon },
  { name: "Twitter", href: "https://twitter.com/opencamp", icon: TwitterIcon },
  { name: "Discord", href: "https://discord.gg/opencamp", icon: DiscordIcon },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--app-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-medium text-[var(--text-1)] transition-opacity hover:opacity-80">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--accent-strong)] to-[var(--accent)] text-xs font-semibold text-slate-950">
                OC
              </span>
              OpenCamp
            </Link>
            <p className="mt-3 text-sm text-[var(--text-3)] max-w-sm leading-relaxed">
              Learn programming with real execution, community feedback, and verifiable progress.
              An open-source platform for mastering software engineering.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--text-3)] transition-all hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-2)] mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/learn" className="link-underline text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/projects" className="link-underline text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/discuss" className="link-underline text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]">
                  Discuss
                </Link>
              </li>
              <li>
                <Link href="/verify" className="link-underline text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-2)] mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-[var(--text-4)] cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-4)] cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
              <li>
                <a
                  href="https://github.com/opencamp/opencamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
                >
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-sm text-[var(--text-4)] text-center">
            © {new Date().getFullYear()} OpenCamp. Built with{" "}
            <span className="text-[var(--accent)]">♥</span> for the open-source community.
          </p>
        </div>
      </div>
    </footer>
  );
}
