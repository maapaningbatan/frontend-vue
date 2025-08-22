// types/api.ts
    import type { LucideIcon } from 'lucide-vue-next';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// API response for authentication
export interface AuthResponse {
  user: User;
  token: string; // If using token-based auth
}

// Breadcrumb item (can be reused for frontend)
export interface BreadcrumbItem {
  title: string;
  href: string;
}

// Navigation item (optional icon for frontend display)
export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  children?: NavItem[];   // recursive sub-menu
  items?: {               // simple link-only sub-menu
    title: string;
    url: string;
  }[];
}


// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Example page props from API
export interface PageData {
  name: string;
  quote: {
    message: string;
    author: string;
  };
  auth: AuthResponse;
  sidebarOpen: boolean;
}

// Request types (for POST/PUT)
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}
