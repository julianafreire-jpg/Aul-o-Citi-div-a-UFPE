export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CapsulePaperColor = "ivory" | "rose" | "sky" | "sage";
export type CapsuleDecoration = "botanical" | "celestial" | "pressed";
export type CapsuleStamp = "flower" | "star" | "heart";
export type CapsuleStatus = "pending" | "sending" | "sent";

export interface CreateCapsuleInput {
  recipientEmail: string;
  subject: string;
  message: string;
  paperColor: CapsulePaperColor;
  decoration: CapsuleDecoration;
  stamps: CapsuleStamp[];
}

export interface Capsule extends CreateCapsuleInput {
  id: string;
  unlockAt: string;
  status: CapsuleStatus;
  createdAt: string;
}

export type AppEnvironment = "development" | "production" | "test";
