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
  interestedIn: string;
  expectedSalary: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  flagIso?: string;
  flagCode?: string;
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
  currentJob: string;
  interestedIn: string;
  expectedSalary: string;
  learningMode: string;
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

export interface UserLeaderboardRow {
  rank: number;
  fullName: string;
  district: string;
  correctCount: number;
  predictionCount: number;
  isYou: boolean;
}

export interface UserLeaderboardResponse {
  top: UserLeaderboardRow[];
  you: { rank: number; correctCount: number; predictionCount: number } | null;
  totalParticipants: number;
  serverTime: string;
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  college: string;
  district: string;
  currentJob?: string;
  interestedIn?: string;
  expectedSalary?: string;
  learningMode?: string;
  predictionCount: number;
  correctCount: number;
}

export interface PublicLeaderboardResponse {
  totalParticipants: number;
  showRank: boolean;
  serverTime: string;
}

export interface MarqueeTeam {
  code: string;
  iso: string;
  label: string;
}

export interface FootballFixture {
  id: number;
  date: string;
  status: string;
  period: string | null;
  minute: number | null;
  round: string;
  home: { name: string; score: number | null; coach: string | null; logo?: string | null };
  away: { name: string; score: number | null; coach: string | null; logo?: string | null };
  venue: { name: string | null; city: string | null; country: string | null } | null;
}

export interface FootballFixturesResponse {
  leagueId: number;
  leagueName: string;
  rounds: string[];
  fixtures: FootballFixture[];
  serverTime: string;
}

export interface FootballLineupPlayer {
  id: number;
  name: string;
  shortName: string;
  position: string | null;
  number: number | null;
}

export interface FootballLineupSide {
  teamId: number;
  teamName: string;
  formation: string | null;
  confidence: number | null;
  players: FootballLineupPlayer[];
  substitutes: FootballLineupPlayer[];
}

export interface FootballLineupsResponse {
  eventId: number;
  lineupStatus: "unavailable" | "predicted" | "confirmed";
  predicted: boolean;
  lineups: FootballLineupSide[];
  serverTime: string;
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

  getMarqueeTeams: () =>
    request<{ teams: MarqueeTeam[]; serverTime: string }>("/api/questions/teams/marquee"),

  submitPrediction: (questionId: string, selectedOptionId: string) =>
    request<{ prediction: { id: string; selectedOptionId: string; createdAt: string } }>(
      "/api/predictions",
      {
        method: "POST",
        body: JSON.stringify({ questionId, selectedOptionId }),
      }
    ),

  getUserLeaderboard: () =>
    request<UserLeaderboardResponse>("/api/predictions/leaderboard"),

  getPublicLeaderboard: () =>
    request<PublicLeaderboardResponse>("/api/predictions/leaderboard/public"),

  getAdminQuestions: () =>
    request<{ questions: AdminQuestion[]; serverTime: string }>("/api/admin/questions"),

  getAdminQuestion: (id: string) =>
    request<{ question: Question; serverTime: string }>(`/api/admin/questions/${id}`),

  getLeaderboard: () =>
    request<{ leaderboard: LeaderboardEntry[]; totalQuestions: number; serverTime: string }>(
      "/api/admin/leaderboard"
    ),

  createQuestion: (data: {
    title: string;
    options: { label: string; flagIso?: string; flagCode?: string }[];
    closesAt: string;
  }) =>
    request<{ question: Question }>("/api/admin/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (
    id: string,
    data: {
      title?: string;
      options?: { id?: string; label: string; flagIso?: string; flagCode?: string }[];
      correctOptionId?: string;
      isActive?: boolean;
      closesAt?: string;
    }
  ) =>
    request<{ question: Question }>(`/api/admin/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getQuestionResults: (id: string) =>
    request<QuestionResults>(`/api/admin/questions/${id}/results`),

  deleteQuestion: (id: string) =>
    request<{ message: string }>(`/api/admin/questions/${id}`, { method: "DELETE" }),

  getFootballFixtures: () =>
    request<FootballFixturesResponse>("/api/football/fixtures"),

  getFootballLineups: (eventId: number) =>
    request<FootballLineupsResponse>(`/api/football/lineups/${eventId}`),
};
