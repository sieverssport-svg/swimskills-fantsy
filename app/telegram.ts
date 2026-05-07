"use client";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id?: number;
            username?: string;
            first_name?: string;
            last_name?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

export function initTelegram() {
  if (typeof window === "undefined") {
    return null;
  }

  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
    return tg;
  }

  return null;
}