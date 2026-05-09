"use client";

export type TelegramUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
};

export type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
  HapticFeedback?: { impactOccurred?: (style: string) => void };
  openTelegramLink?: (url: string) => void;
  shareToStory?: (mediaUrl: string, params?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegram(): TelegramUser | null {
  const tg = getTelegram();
  if (!tg) return null;
  tg.ready?.();
  tg.expand?.();
  return tg.initDataUnsafe?.user ?? null;
}

export function haptic(style: "light" | "medium" | "heavy" = "light"): void {
  getTelegram()?.HapticFeedback?.impactOccurred?.(style);
}
