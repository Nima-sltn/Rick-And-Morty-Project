import { ReactNode } from "react";
import { Character, Episode, Location } from "./api.types";

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface SkeletonProps {
  type: "card" | "list" | "detail" | "grid";
  count?: number;
}

export interface FavoriteItem {
  id: number;
  type: "character" | "episode" | "location";
  data: Character | Episode | Location;
  addedAt: string;
}

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}
