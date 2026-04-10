"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadPdf } from "@/lib/api/vectorize";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export function PdfUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onUpload = async () => {
    if (!file) {
      setIsError(true);
      setMessage("Please select a PDF file first.");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMessage("");

    try {
      const response = await uploadPdf(file);
      setMessage(response.message || "Upload queued successfully.");
    } catch (error) {
      setIsError(true);
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage("Unable to upload PDF right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-medium">Upload your PDF</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        This sends the file to the backend queue for chunking and embedding.
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="block w-full rounded-md border bg-background p-2 text-sm"
        />
        <Button onClick={onUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload />
              Upload PDF
            </>
          )}
        </Button>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            isError ? "text-destructive" : "text-green-600 dark:text-green-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
