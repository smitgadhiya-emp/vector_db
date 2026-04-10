import type { ApiResponse } from "@/lib/api/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  "http://localhost:4000/api/v1";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | null;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body = null, headers = {}, signal } = options;
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    body,
    headers,
    signal,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    const message =
      "message" in payload && payload.message
        ? payload.message
        : "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, { method: "GET" });
}

export async function apiPostForm<T>(
  path: string,
  formData: FormData,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, {
    method: "POST",
    body: formData,
  });
}
