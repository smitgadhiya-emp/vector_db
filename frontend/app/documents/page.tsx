import { Clock3, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const placeholderDocs = [
  { name: "onboarding-guide.pdf", status: "Indexed", updatedAt: "2 hours ago" },
  { name: "pricing-faq.pdf", status: "Processing", updatedAt: "10 minutes ago" },
  { name: "compliance-notes.pdf", status: "Indexed", updatedAt: "Yesterday" },
];

export default function DocumentsPage() {
  return (
    <AppShell
      title="Documents"
      subtitle="Dummy page for document listing, status, and history."
    >
      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-lg font-medium">Recent uploads</h2>
        <div className="space-y-2">
          {placeholderDocs.map((doc) => (
            <article
              key={doc.name}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span>{doc.name}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{doc.status}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="size-3" />
                  {doc.updatedAt}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
