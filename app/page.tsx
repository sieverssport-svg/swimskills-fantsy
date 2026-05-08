"use client";

import { useEffect, useState } from "react";

type Rarity = "Rare" | "Elite" | "GOAT";

type Card = {
id: string;
serial: string;
name: string;
image: string;
rarity: Rarity;
color: string;
};

type CollectionItem = Card & {
count: number;
};

type MarketCard = Card & {
price: number;
};

type Tab = "home" | "collection" | "market" | "news";

type Lang = "en" | "ru";

declare global {
interface Window {
Telegram?: {
WebApp?: {
ready?: () => void;
expand?: () => void;
initDataUnsafe?: {
user?: {
language_code?: string;
};
};
};
};
}
}

const dictionary = {
en: {
username: "@whoissievers",
currency: "SS",
yourPack: "Your Pack",
openPack: "Open Pack",
swipeCards: "← swipe cards →",
swipeCollection: "← swipe collection →",
swipeMarket: "← swipe market →",
premiumVault: "PREMIUM VAULT",
myCollection: "My Collection",
cardsOwned: "Cards owned",
unique: "Unique",
market: "Market",
newsTitle: "Swim Skills News",
newsText:
"Latest swimming news, records, NCAA stories and fantasy league updates.",
openTelegram: "Open Telegram Channel",
home: "Home",
collection: "Collection",
news: "News",
buy: "Buy",
sell: "Sell",
upgrade: "Upgrade",
alreadyGoat: "Already GOAT",
needDuplicates: "Need 2 duplicates",
notEnough: "Not enough SS",
},
ru: {
username: "@whoissievers",
currency: "SS",
yourPack: "Твой пак",
openPack: "Открыть пак",
swipeCards: "← листай карточки →",
swipeCollection: "← листай коллекцию →",
swipeMarket: "← листай маркет →",
premiumVault: "ПРЕМИУМ ХРАНИЛИЩЕ",
myCollection: "Моя коллекция",
cardsOwned: "Карточек",
unique: "Уникальных",
market: "Маркет",
newsTitle: "Swim Skills News",
newsText:
"Новости плавания, рекорды, NCAA, мировые старты и обновления Fantasy League.",
openTelegram: "Открыть Telegram-канал",
home: "Главная",
collection: "Коллекция",
news: "Новости",
buy: "Купить",
sell: "Продать",
upgrade: "Улучшить",
alreadyGoat: "Карточка уже GOAT",
needDuplicates: "Нужно 2 дубликата",
notEnough: "Недостаточно SS",
},
};

const marketCards: MarketCard[] = [
{
id: "summer",
serial: "AS-001",
name: "Summer McIntosh",
image: "/summer-card.png",
rarity: "GOAT",
color: "#f5c542",
price: 500,
},
{
id: "mckeown",
serial: "AS-002",
name: "Kaylee McKeown",
image: "/mckeown-card.png",
rarity: "GOAT",
color: "#3fbf6f",
price: 480,
},
{
id: "ledecky",
serial: "AS-003",
name: "Katie Ledecky",
image: "/ledecky-card.png",
rarity: "GOAT",
color: "#4da3ff",
price: 520,
},
{
id: "douglass",
serial: "AS-004",
name: "Kate Douglass",
image: "/douglass-card.png",
rarity: "Elite",
color: "#b06cff",
price: 350,
},
{
id: "evans",
serial: "AS-005",
name: "Angharad Evans",
image: "/evans-card.png",
rarity: "Rare",
color: "#ff7b54",
price: 220,
},
];

function getSellPrice(rarity: Rarity) {
if (rarity === "Rare") return 100;
if (rarity === "Elite") return 300;
return 700;
}

function getUpgradeCost(rarity: Rarity) {
if (rarity === "Rare") return 150;
if (rarity === "Elite") return 350;
return 0;
}

function getNextRarity(rarity: Rarity): Rarity | null {
if (rarity === "Rare") return "Elite";
if (rarity === "Elite") return "GOAT";
return null;
}

function getTelegramLanguage(): Lang {
if (typeof window === "undefined") return "en";

const code =
window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || "en";

if (code.startsWith("ru")) return "ru";

return "en";
}

export default function Home() {
const [lang, setLang] = useState<Lang>("en");
const [balance, setBalance] = useState(1675);
const [collection, setCollection] = useState<CollectionItem[]>([]);
const [activeTab, setActiveTab] = useState<Tab>("home");
const [selectedCard, setSelectedCard] = useState<Card | null>(null);

const t = dictionary[lang];

useEffect(() => {
window.Telegram?.WebApp?.ready?.();
window.Telegram?.WebApp?.expand?.();

setLang(getTelegramLanguage());

const savedCollection = localStorage.getItem("collection");
const savedBalance = localStorage.getItem("balance");

if (savedCollection) setCollection(JSON.parse(savedCollection));
if (savedBalance) setBalance(Number(savedBalance));
}, []);

useEffect(() => {
localStorage.setItem("collection", JSON.stringify(collection));
localStorage.setItem("balance", balance.toString());
}, [collection, balance]);

const addCardToCollection = (card: Card) => {
setCollection((prev) => {
const existing = prev.find((c) => c.id === card.id);

if (existing) {
return prev.map((c) =>
c.id === card.id ? { ...c, count: c.count + 1 } : c
);
}

return [...prev, { ...card, count: 1 }];
});
};

const openStarterPack = () => {
const randomCard =
marketCards[Math.floor(Math.random() * marketCards.length)];

addCardToCollection(randomCard);
};

const sellCard = (card: CollectionItem) => {
const sellPrice = getSellPrice(card.rarity);

setBalance((prev) => prev + sellPrice);

setCollection((prev) =>
prev
.map((c) => (c.id === card.id ? { ...c, count: c.count - 1 } : c))
.filter((c) => c.count > 0)
);
};

const upgradeCard = (card: CollectionItem) => {
const nextRarity = getNextRarity(card.rarity);
const cost = getUpgradeCost(card.rarity);

if (!nextRarity) {
alert(t.alreadyGoat);
return;
}

if (card.count < 2) {
alert(t.needDuplicates);
return;
}

if (balance < cost) {
alert(t.notEnough);
return;
}

const rewardPool = marketCards.filter((c) => c.rarity === nextRarity);
const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];

setBalance((prev) => prev - cost);

setCollection((prev) =>
prev
.map((c) => (c.id === card.id ? { ...c, count: c.count - 2 } : c))
.filter((c) => c.count > 0)
);

addCardToCollection(reward);
};

const totalCards = collection.reduce((sum, c) => sum + c.count, 0);

const openTelegramNews = () => {
window.open("https://t.me/swimskills", "_blank");
};

return (
<div className="app">
<style>{`
* {
box-sizing: border-box;
}

body {
margin: 0;
background: #000;
}

.app {
min-height: 100vh;
min-height: 100dvh;
background:
radial-gradient(circle at top, rgba(255,204,0,0.13), transparent 30%),
#000;
color: white;
padding: 18px 14px 112px;
overflow-x: hidden;
font-family: Arial, Helvetica, sans-serif;
}

.topbar {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 18px;
gap: 14px;
}

.brand-title {
color: #ffcc00;
font-size: 34px;
font-weight: 900;
margin: 0;
line-height: 0.95;
}

.username {
color: #999;
margin-top: 6px;
font-size: 15px;
}

.balance {
border: 2px solid #ffcc00;
border-radius: 24px;
padding: 9px 18px;
color: #ffcc00;
font-weight: 900;
font-size: 22px;
text-align: center;
min-width: 100px;
box-shadow: 0 0 18px rgba(255,204,0,0.15);
}

.screen {
width: 100%;
}

.pack-header {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
margin-top: 18px;
margin-bottom: 14px;
}

.section-title {
color: #ffcc00;
font-size: 24px;
font-weight: 900;
margin: 0;
}

.pack-button {
border: 1.5px solid rgba(255,204,0,0.85);
border-radius: 16px;
padding: 10px 16px;
background: linear-gradient(135deg, #ffcc00, #ffe680);
color: #000;
font-weight: 900;
font-size: 15px;
box-shadow: 0 0 16px rgba(255,204,0,0.2);
white-space: nowrap;
}

.scroll-row {
display: flex;
gap: 14px;
overflow-x: auto;
padding-bottom: 14px;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
}

.scroll-row::-webkit-scrollbar {
display: none;
}

.card {
min-width: 220px;
max-width: 220px;
background: #0c0c0c;
border-radius: 22px;
overflow: hidden;
scroll-snap-align: start;
cursor: pointer;
box-shadow: 0 10px 24px rgba(0,0,0,0.45);
}

.card-img {
width: 100%;
display: block;
}

.card-body {
padding: 12px;
}

.card-name {
margin: 0;
font-size: 16px;
font-weight: 800;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.card-meta {
color: #999;
margin-top: 6px;
font-size: 14px;
}

.actions {
display: flex;
flex-direction: column;
gap: 8px;
margin-top: 12px;
}

.btn {
width: 100%;
padding: 10px;
border-radius: 12px;
font-weight: 900;
border: none;
font-size: 13px;
}

.btn-gold {
background: linear-gradient(135deg, #ffcc00, #ffe680);
color: #000;
}

.btn-dark {
background: transparent;
color: #ffcc00;
border: 1px solid #ffcc00;
}

.swipe-hint {
text-align: center;
color: rgba(255,204,0,0.55);
font-size: 12px;
font-weight: 800;
letter-spacing: 1px;
margin-top: -2px;
margin-bottom: 12px;
}

.vault {
border: 1px solid rgba(255,204,0,0.3);
border-radius: 24px;
padding: 18px;
background:
linear-gradient(180deg, rgba(255,204,0,0.1), rgba(0,0,0,0.85)),
#080808;
margin-bottom: 18px;
box-shadow: 0 0 30px rgba(255,204,0,0.12);
}

.vault-kicker {
color: #ffcc00;
font-size: 11px;
letter-spacing: 3px;
font-weight: 900;
margin: 0;
}

.vault-title {
margin: 8px 0;
font-size: 28px;
font-weight: 900;
}

.vault-subtitle {
color: #999;
margin: 0;
}

.news-card {
border: 1px solid rgba(255,204,0,0.35);
border-radius: 26px;
padding: 22px;
background:
linear-gradient(180deg, rgba(255,204,0,0.12), rgba(0,0,0,0.86)),
#080808;
box-shadow: 0 0 32px rgba(255,204,0,0.12);
}

.news-title {
color: #ffcc00;
font-size: 30px;
font-weight: 900;
margin: 0 0 10px;
}

.news-text {
color: #aaa;
font-size: 16px;
line-height: 1.45;
margin: 0 0 18px;
}

.modal {
position: fixed;
inset: 0;
background: rgba(0,0,0,0.92);
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
padding: 18px;
}

.modal-img {
width: min(92vw, 420px);
max-height: 86dvh;
object-fit: contain;
border-radius: 24px;
}

.bottom-nav {
position: fixed;
left: 12px;
right: 12px;
bottom: 14px;
z-index: 100;
background: linear-gradient(180deg, #111, #070707);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 30px;
padding: 12px 8px;
display: flex;
justify-content: space-around;
align-items: center;
box-shadow: 0 0 32px rgba(0,0,0,0.75);
backdrop-filter: blur(12px);
}

.nav-btn {
width: 25%;
background: none;
border: none;
color: #666;
display: flex;
flex-direction: column;
align-items: center;
gap: 5px;
font-size: 11px;
font-weight: 900;
}

.nav-icon {
font-size: 22px;
line-height: 1;
}

.nav-btn.active {
color: #ffcc00;
}
`}</style>

<div className="topbar">
<div>
<h1 className="brand-title">Swim Skills</h1>
<div className="username">{t.username}</div>
</div>

<div className="balance">
{balance}
<br />
{t.currency}
</div>
</div>

{activeTab === "home" && (
<div className="screen">
<div className="pack-header">
<h2 className="section-title">{t.yourPack}</h2>

<button className="pack-button" onClick={openStarterPack}>
{t.openPack}
</button>
</div>

<CardRow
cards={collection}
setSelectedCard={setSelectedCard}
sellCard={sellCard}
upgradeCard={upgradeCard}
t={t}
/>

<div className="swipe-hint">{t.swipeCards}</div>
</div>
)}

{activeTab === "collection" && (
<div className="screen">
<div className="vault">
<p className="vault-kicker">{t.premiumVault}</p>

<h2 className="vault-title">{t.myCollection}</h2>

<p className="vault-subtitle">
{t.cardsOwned}: {totalCards} · {t.unique}: {collection.length}
</p>
</div>

<CardRow
cards={collection}
setSelectedCard={setSelectedCard}
sellCard={sellCard}
upgradeCard={upgradeCard}
t={t}
/>

<div className="swipe-hint">{t.swipeCollection}</div>
</div>
)}

{activeTab === "market" && (
<div className="screen">
<div className="pack-header">
<h2 className="section-title">{t.market}</h2>
</div>

<div className="scroll-row">
{marketCards.map((card) => (
<div
key={card.id}
className="card"
style={{ border: `2px solid ${card.color}` }}
onClick={() => setSelectedCard(card)}
>
<img className="card-img" src={card.image} alt={card.name} />

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">{card.rarity}</div>

<button
className="btn btn-gold"
style={{ marginTop: 12 }}
onClick={(e) => {
e.stopPropagation();

if (balance < card.price) {
alert(t.notEnough);
return;
}

setBalance((prev) => prev - card.price);
addCardToCollection(card);
}}
>
{t.buy} · {card.price} {t.currency}
</button>
</div>
</div>
))}
</div>

<div className="swipe-hint">{t.swipeMarket}</div>
</div>
)}

{activeTab === "news" && (
<div className="screen">
<div className="news-card">
<h2 className="news-title">{t.newsTitle}</h2>

<p className="news-text">{t.newsText}</p>

<button className="pack-button" onClick={openTelegramNews}>
{t.openTelegram}
</button>
</div>
</div>
)}

{selectedCard && (
<div className="modal" onClick={() => setSelectedCard(null)}>
<img
className="modal-img"
src={selectedCard.image}
alt={selectedCard.name}
style={{
border: `3px solid ${selectedCard.color}`,
boxShadow: `0 0 40px ${selectedCard.color}`,
}}
/>
</div>
)}

<div className="bottom-nav">
<NavButton
tab="home"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="⌂"
label={t.home}
/>

<NavButton
tab="collection"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="▥"
label={t.collection}
/>

<NavButton
tab="market"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="🛒"
label={t.market}
/>

<NavButton
tab="news"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="▤"
label={t.news}
/>
</div>
</div>
);
}

function CardRow({
cards,
setSelectedCard,
sellCard,
upgradeCard,
t,
}: {
cards: CollectionItem[];
setSelectedCard: (card: Card) => void;
sellCard: (card: CollectionItem) => void;
upgradeCard: (card: CollectionItem) => void;
t: typeof dictionary.en;
}) {
return (
<div className="scroll-row">
{cards.map((card) => (
<div
key={card.id}
className="card"
style={{ border: `2px solid ${card.color}` }}
onClick={() => setSelectedCard(card)}
>
<img className="card-img" src={card.image} alt={card.name} />

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">
{card.rarity} · x{card.count}
</div>

<div className="actions">
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
>
{t.upgrade}
</button>

<button
className="btn btn-dark"
onClick={(e) => {
e.stopPropagation();
sellCard(card);
}}
>
{t.sell} · {getSellPrice(card.rarity)} {t.currency}
</button>
</div>
</div>
</div>
))}
</div>
);
}

function NavButton({
tab,
activeTab,
setActiveTab,
icon,
label,
}: {
tab: Tab;
activeTab: Tab;
setActiveTab: (tab: Tab) => void;
icon: string;
label: string;
}) {
const isActive = activeTab === tab;

return (
<button
className={`nav-btn ${isActive ? "active" : ""}`}
onClick={() => setActiveTab(tab)}
>
<span className="nav-icon">{icon}</span>
<span>{label}</span>
</button>
);
}

