import Link from "next/link";
import { FileUp, MessageCircleMore } from "lucide-react";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/upload", label: "Upload PDF", icon: FileUp },
  { href: "/chat", label: "Ask Question", icon: MessageCircleMore },
];

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground transition hover:text-foreground"
            >
              {Icon ? <Icon className="size-4" /> : null}
              <span>{label}</span>
            </Link>
          ))}
        </div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>
      {children}
    </main>
  );
}
