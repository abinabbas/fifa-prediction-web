import { getApiBaseUrl } from "@/lib/config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError(
      "API URL is not configured. Set NEXT_PUBLIC_API_URL in your environment.",
      0
    );
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || "Request failed", res.status);
  }

  return data as T;
}

export interface User {
  id: string;
  phone: string;
  fullName: string;
  email: string;
  college: string;
  district: string;
  role: "user" | "admin";
}

export interface RegisterData {
  fullName: string;
  phone: string;
  email: string;
  college: string;
  district: string;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
  closesAt: string;
  isActive: boolean;
  correctOptionId?: string;
  createdAt?: string;
}

export interface ActiveQuestionResponse {
  question: Question | null;
  serverTime: string;
  prediction: { selectedOptionId: string; createdAt: string } | null;
}

export interface OpenQuestionsResponse {
  questions: Question[];
  serverTime: string;
  predictions: Record<string, { selectedOptionId: string; createdAt: string }>;
}

export interface AdminQuestion extends Question {
  totalPredictions: number;
  optionCounts: Record<string, number>;
}

export interface PredictionRow {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  college: string;
  district: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  predictedAt: string;
  isCorrect: boolean | null;
}

export interface QuestionResults {
  question: Question;
  totalPredictions: number;
  optionCounts: Record<string, number>;
  votersByOption: Record<string, { phone: string; fullName?: string; predictedAt: string }[]>;
  predictions: PredictionRow[];
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  college: string;
  district: string;
  predictionCount: number;
  correctCount: number;
}

export const api = {
  register: (data: RegisterData) =>
    request<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (phone: string) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  adminLogin: (email: string, password: string) =>
    request<{ user: User }>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ message: string }>("/api/auth/logout", { method: "POST" }),

  me: () => request<{ user: User }>("/api/auth/me"),

  getActiveQuestion: () => request<ActiveQuestionResponse>("/api/questions/active"),

  getOpenQuestions: () => request<OpenQuestionsResponse>("/api/questions/open"),

  getPublicOpenQuestions: () =>
    request<{ questions: Question[]; serverTime: string }>("/api/questions/open/public"),

  submitPrediction: (questionId: string, selectedOptionId: string) =>
    request<{ prediction: { id: string; selectedOptionId: string; createdAt: string } }>(
      "/api/predictions",
      {
        method: "POST",
        body: JSON.stringify({ questionId, selectedOptionId }),
      }
    ),

  getAdminQuestions: () =>
    request<{ questions: AdminQuestion[]; serverTime: string }>("/api/admin/questions"),

  getLeaderboard: () =>
    request<{ leaderboard: LeaderboardEntry[]; totalQuestions: number; serverTime: string }>(
      "/api/admin/leaderboard"
    ),

  createQuestion: (data: { title: string; options: { label: string }[]; closesAt: string }) =>
    request<{ question: Question }>("/api/admin/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (
    id: string,
    data: { correctOptionId?: string; isActive?: boolean; closesAt?: string }
  ) =>
    request<{ question: Question }>(`/api/admin/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getQuestionResults: (id: string) =>
    request<QuestionResults>(`/api/admin/questions/${id}/results`),

  deleteQuestion: (id: string) =>
    request<{ message: string }>(`/api/admin/questions/${id}`, { method: "DELETE" }),
};
