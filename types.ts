import React from "react";

// ===== Landing Page Types =====

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "Web App" | "Mobile App" | "Reporting";
  imageUrl: string;
  description: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  service: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

// ===== Admin Types =====

export interface AdminUser {
  email: string;
  name: string;
}

export type ProjectStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
export type TransactionType = "Income" | "Expense";

export interface AdminProject {
  id: string;
  name: string;
  client: string;
  value: number;
  status: ProjectStatus;
  deadline: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  projectId: string;
  type: TransactionType;
}

// ===== Sync Types =====

export type SyncStatus = "idle" | "success" | "error";

export interface JsonBinConfig {
  binId: string;
  apiKey: string;
}

// ===== Navigation Types =====

export type PageName = "home" | "login" | "admin";
