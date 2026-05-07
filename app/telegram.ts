"use client";

import { init } from "@telegram-apps/sdk";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export function initTelegram() {
  try {
    init();

    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      return tg;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
}