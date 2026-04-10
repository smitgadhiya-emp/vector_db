import { AppShell } from "@/components/layout/app-shell";
import { PdfChatCard } from "@/components/pdf/pdf-chat-card";

export default function ChatPage() {
  return (
    <AppShell
      title="PDF Chat"
      subtitle="Ask questions against vectorized content in your uploaded PDFs."
    >
      <PdfChatCard />
    </AppShell>
  );
}
