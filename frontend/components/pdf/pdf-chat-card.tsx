"use client";

import { useState } from "react";
import { Bot, Loader2, MessageCircle, SendHorizontal } from "lucide-react";
import { askPdfQuestion } from "@/lib/api/vectorize";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function PdfChatCard() {
  const [question, setQuestion] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Upload a PDF first, then ask a question. I will use the vectorized chunks to answer.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onAsk = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");

    try {
      const response = await askPdfQuestion(
        trimmedQuestion,
        documentId.trim() || undefined,
      );
      if (!response.success) {
        throw new ApiError(response.message, 400);
      }
      const answer =
        response.data?.answer || "No answer returned from the backend.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch answer. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-medium">Ask PDF questions</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Chat-style UI for RAG queries. This is ready for backend integration.
      </p>

      <div className="mb-3 grid gap-2">
        <label className="text-sm text-muted-foreground" htmlFor="document-id">
          Document ID (optional)
        </label>
        <input
          id="document-id"
          value={documentId}
          onChange={(event) => setDocumentId(event.target.value)}
          placeholder="e.g. 0d2b0c44-...."
          className="rounded-md border bg-background p-2 text-sm"
        />
      </div>

      <div className="mb-3 max-h-80 space-y-2 overflow-y-auto rounded-lg border bg-background p-3">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`rounded-md p-2 text-sm ${
              message.role === "user"
                ? "bg-primary/10"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <div className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              {message.role === "user" ? (
                <MessageCircle className="size-3" />
              ) : (
                <Bot className="size-3" />
              )}
              {message.role}
            </div>
            <p>{message.content}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask something about your PDF..."
          className="min-h-24 rounded-md border bg-background p-2 text-sm"
        />
        <Button onClick={onAsk} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <SendHorizontal />
              Ask
            </>
          )}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
