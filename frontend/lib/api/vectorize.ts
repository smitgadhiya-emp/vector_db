import { apiGet, apiPostForm } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export type PdfUploadResult = {
  documentId?: string;
};

export type PdfQueryResult = {
  answer: string | null;
};

export function uploadPdf(file: File): Promise<ApiResponse<PdfUploadResult>> {
  const formData = new FormData();
  formData.append("pdf", file);
  return apiPostForm<PdfUploadResult>("/upload/pdf", formData);
}

export function askPdfQuestion(
  query: string,
  documentId?: string,
): Promise<ApiResponse<PdfQueryResult>> {
  const searchParams = new URLSearchParams({ query });
  if (documentId) {
    searchParams.set("documentId", documentId);
  }
  return apiGet<PdfQueryResult>(`/upload/query?${searchParams.toString()}`);
}
