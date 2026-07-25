// ============================================================================
// Lead Model
// ============================================================================

export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  budget: number;
  message: string;
  status: LeadStatus;
  createdAt: string;
  source?: string;
  company?: string;
  phone?: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  budget: number;
  message: string;
}

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
  conversionRate: number;
  avgBudget: number;
}

export interface Activity {
  id: string;
  type: "lead_created" | "status_changed" | "lead_contacted";
  leadName: string;
  description: string;
  timestamp: string;
}

export type NotificationType = "lead_created" | "status_changed" | "lead_deleted" | "system";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  leadId: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Component Props
// ============================================================================

export interface AnimatedInputProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface AnimatedTextareaProps {
  label: string;
  name: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
}

export interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
}

export interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md" | "lg";
}

export interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
