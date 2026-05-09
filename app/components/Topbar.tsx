"use client";

import type { Lang } from "../lib/i18n";

export function Topbar({
  username,
  lang,
  setLang,
  rightSlot,
}: {
  username: string;
  lang: Lang;
  setLang: (lang: Lang) => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="topbar">
      <div>
        <h1 className="brand">Swim Skills</h1>
        <div className="username">{username}</div>
      </div>

      {rightSlot ?? (
        <div className="lang-switch">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>
            RU
          </button>
        </div>
      )}
    </div>
  );
}
