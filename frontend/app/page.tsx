import Link from "next/link";
import { FileText, MessageSquareText, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Upload PDF",
    description:
      "Upload a PDF and queue it for embedding. This page is connected to backend API.",
    href: "/upload",
    icon: UploadCloud,
  },
  {
    title: "Ask Questions",
    description:
      "Chat-style interface to ask questions from indexed PDF chunks.",
    href: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Documents",
    description: "Placeholder page for future list/history of uploaded files.",
    href: "/documents",
    icon: FileText,
  },
];

export default function Page() {
  return (
    <AppShell
      title="PDF Chat Dashboard"
      subtitle="Upload documents and ask questions in a chatbot-style workflow."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map(({ title, description, href, icon: Icon }) => (
          <article key={title} className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="size-4 text-muted-foreground" />
              <h2 className="font-medium">{title}</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            <Button asChild variant="outline">
              <Link href={href}>Open</Link>
            </Button>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
