import { AppShell } from "@/components/layout/app-shell";
import { PdfUploadCard } from "@/components/pdf/pdf-upload-card";

export default function UploadPage() {
  return (
    <AppShell
      title="Upload PDF"
      subtitle="Choose a PDF and send it for embedding."
    >
      <PdfUploadCard />
    </AppShell>
  );
}
