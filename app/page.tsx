"use client";

import { useEffect, useState } from "react";

type Rarity = "Rare" | "Elite" | "GOAT" | "Legend";
type Tab = "home" | "collection" | "market" | "tournament";
type Lang = "en" | "ru";

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

type LegendSlot = {
id: string;
name: string;
country: string;
};

type TelegramWindow = Window & {
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
};

const dictionary = {
en: {
username: "@whoissievers",
currency: "SS",
yourPack: "Your Pack",
openPack: "Open Pack",
home: "Home",
collection: "Collection",
market: "Market",
tournament: "Tournament",
buy: "Buy",
sell: "Sell",
upgrade: "Upgrade",
notEnough: "Not enough SS",
needDuplicates: "Need 2 duplicates",
alreadyLegend: "Already Legend",
premiumVault: "PREMIUM VAULT",
myCollection: "My Collection",
cardsOwned: "Cards owned",
unique: "Unique",
hallTitle: "Hall of Fame Women",
hallText: "Legend cards are awarded to tournament winners. Unlock them and place them into the Hall of Fame.",
locked: "Locked",
unlocked: "Unlocked",
addToHall: "Add to Hall of Fame",
inHall: "In Hall of Fame",
tournamentsTitle: "Fantasy Tournaments",
tournamentsText: "Choose upcoming competitions, enter with your team and compete in Swim Skills Fantasy League.",
enterTeam: "Enter with team",
comingSoon: "Coming soon",
liveSoon: "Registration open",
},
ru: {
username: "@whoissievers",
currency: "SS",
yourPack: "Твой пак",
openPack: "Открыть пак",
home: "Главная",
collection: "Коллекция",
market: "Маркет",
tournament: "Турнир",
buy: "Купить",
sell: "Продать",
upgrade: "Улучшить",
notEnough: "Недостаточно SS",
needDuplicates: "Нужно 2 дубликата",
alreadyLegend: "Уже Legend",
premiumVault: "ПРЕМИУМ ХРАНИЛИЩЕ",
myCollection: "Моя коллекция",
cardsOwned: "Карточек",
unique: "Уникальных",
hallTitle: "Hall of Fame Women",
hallText: "Карточки Legend получают победители турниров. Открой легенду и добавь её в Зал славы.",
locked: "Закрыто",
unlocked: "Открыто",
addToHall: "Добавить в Зал славы",
inHall: "В Зале славы",
tournamentsTitle: "Фентези-турниры",
tournamentsText: "Выбирай соревнования, заявляй команду и участвуй в Swim Skills Fantasy League.",
enterTeam: "Войти командой",
comingSoon: "Скоро",
liveSoon: "Регистрация открыта",
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

const legendWomen: LegendSlot[] = [
{ id: "missy-franklin", name: "Missy Franklin", country: "USA" },
{ id: "federica-pellegrini", name: "Federica Pellegrini", country: "ITA" },
{ id: "laure-manaudou", name: "Laure Manaudou", country: "FRA" },
{ id: "rebecca-soni", name: "Rebecca Soni", country: "USA" },
{ id: "inge-de-bruijn", name: "Inge De Bruijn", country: "NED" },
{ id: "natalie-coughlin", name: "Natalie Coughlin", country: "USA" },
{ id: "emma-mckeon", name: "Emma McKeon", country: "AUS" },
{ id: "katinka-hosszu", name: "Katinka Hosszu", country: "HUN" },
{ id: "cate-campbell", name: "Cate Campbell", country: "AUS" },
{ id: "ariarne-titmus", name: "Ariarne Titmus", country: "AUS" },
{ id: "ye-shiwen", name: "Ye Shiwen", country: "CHN" },
{ id: "kirsty-coventry", name: "Kirsty Coventry", country: "ZIM" },
{ id: "tatiana-schoenmaker", name: "Tatiana Schoenmaker", country: "RSA" },
{ id: "ranomi-kromowidjojo", name: "Ranomi Kromowidjojo", country: "NED" },
{ id: "leisel-jones", name: "Leisel Jones", country: "AUS" },
];

function getSellPrice(rarity: Rarity) {
if (rarity === "Rare") return 100;
if (rarity === "Elite") return 300;
if (rarity === "GOAT") return 700;
return 2500;
}

function getUpgradeCost(rarity: Rarity) {
if (rarity === "Rare") return 150;
if (rarity === "Elite") return 350;
if (rarity === "GOAT") return 1200;
return 0;
}

function getNextRarity(rarity: Rarity): Rarity | null {
if (rarity === "Rare") return "Elite";
if (rarity === "Elite") return "GOAT";
if (rarity === "GOAT") return "Legend";
return null;
}

function getTelegramLanguage(): Lang {
if (typeof window === "undefined") return "en";
const tgWindow = window as TelegramWindow;
const code =
tgWindow.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || "en";
return code.startsWith("ru") ? "ru" : "en";
}

export default function Home() {
const [lang, setLang] = useState<Lang>("en");
const [balance, setBalance] = useState(1675);
const [collection, setCollection] = useState<CollectionItem[]>([]);
const [hallOfFame, setHallOfFame] = useState<string[]>([]);
const [activeTab, setActiveTab] = useState<Tab>("home");
const [selectedCard, setSelectedCard] = useState<Card | null>(null);

const t = dictionary[lang];

useEffect(() => {
const tgWindow = window as TelegramWindow;
tgWindow.Telegram?.WebApp?.ready?.();
tgWindow.Telegram?.WebApp?.expand?.();

setLang(getTelegramLanguage());

const savedCollection = localStorage.getItem("collection");
const savedBalance = localStorage.getItem("balance");
const savedHall = localStorage.getItem("hallOfFameWomen");

if (savedCollection) setCollection(JSON.parse(savedCollection));
if (savedBalance) setBalance(Number(savedBalance));
if (savedHall) setHallOfFame(JSON.parse(savedHall));
}, []);

useEffect(() => {
localStorage.setItem("collection", JSON.stringify(collection));
localStorage.setItem("balance", balance.toString());
localStorage.setItem("hallOfFameWomen", JSON.stringify(hallOfFame));
}, [collection, balance, hallOfFame]);

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
alert(t.alreadyLegend);
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

setBalance((prev) => prev - cost);

setCollection((prev) =>
prev
.map((c) => (c.id === card.id ? { ...c, count: c.count - 2 } : c))
.filter((c) => c.count > 0)
);

if (nextRarity === "Legend") {
const randomLegend =
legendWomen[Math.floor(Math.random() * legendWomen.length)];

addCardToCollection({
id: randomLegend.id,
serial: "LEGEND-W",
name: randomLegend.name,
image: "",
rarity: "Legend",
color: "#ffcc00",
});

return;
}

const rewardPool = marketCards.filter((c) => c.rarity === nextRarity);
const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];
addCardToCollection(reward);
};

const addToHallOfFame = (legendId: string) => {
if (hallOfFame.includes(legendId)) return;
setHallOfFame((prev) => [...prev, legendId]);
};

const totalCards = collection.reduce((sum, c) => sum + c.count, 0);

return (
<div className="app">
<style>{`
* { box-sizing: border-box; }
body { margin: 0; background: #000; }

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

.screen { width: 100%; }

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

.scroll-row::-webkit-scrollbar { display: none; }

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

.legend-placeholder {
height: 285px;
background:
radial-gradient(circle at center, rgba(255,204,0,0.13), transparent 45%),
linear-gradient(180deg, #181818, #050505);
display: flex;
align-items: center;
justify-content: center;
color: rgba(255,255,255,0.18);
font-size: 86px;
font-weight: 900;
}

.card-body { padding: 12px; }

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

.vault, .tournament-intro, .hall-intro {
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
line-height: 1.45;
}

.hall-row {
display: flex;
flex-direction: column;
gap: 12px;
padding-bottom: 24px;
}

.hof-card {
position: relative;
min-height: 126px;
border-radius: 24px;
padding: 16px;
overflow: hidden;
background:
radial-gradient(circle at right, rgba(255,204,0,0.16), transparent 35%),
linear-gradient(135deg, #151515, #050505);
border: 1px solid rgba(255,204,0,0.28);
display: flex;
align-items: center;
gap: 16px;
box-shadow: 0 12px 30px rgba(0,0,0,0.42);
}

.hof-card.unlocked {
border-color: rgba(255,204,0,0.85);
box-shadow: 0 0 28px rgba(255,204,0,0.18);
}

.hof-silhouette {
width: 82px;
min-width: 82px;
height: 94px;
border-radius: 20px;
background:
radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 47%),
linear-gradient(180deg, #222, #060606);
border: 1px solid rgba(255,204,0,0.18);
display: flex;
align-items: center;
justify-content: center;
font-size: 42px;
color: rgba(255,255,255,0.16);
}

.hof-info {
flex: 1;
min-width: 0;
}

.hof-kicker {
color: #ffcc00;
font-size: 11px;
font-weight: 900;
letter-spacing: 2px;
margin-bottom: 6px;
}

.hof-name {
font-size: 20px;
font-weight: 900;
line-height: 1.05;
margin-bottom: 6px;
}

.hof-country {
color: #999;
font-size: 13px;
font-weight: 800;
}

.hof-lock {
position: absolute;
right: 14px;
top: 14px;
font-size: 20px;
}

.hof-status {
margin-top: 10px;
color: #ffcc00;
font-size: 12px;
font-weight: 900;
}

.tournament-list {
display: flex;
flex-direction: column;
gap: 16px;
padding-bottom: 20px;
}

.tournament-card {
border-radius: 26px;
padding: 18px;
background:
radial-gradient(circle at top right, rgba(255,204,0,0.15), transparent 32%),
#080808;
border: 1.5px solid rgba(255,204,0,0.28);
box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}

.tournament-status {
display: inline-block;
padding: 6px 10px;
border-radius: 999px;
background: rgba(255,204,0,0.12);
color: #ffcc00;
font-size: 12px;
font-weight: 900;
margin-bottom: 12px;
}

.tournament-title {
font-size: 24px;
font-weight: 900;
margin: 0 0 12px;
}

.tournament-info {
color: #aaa;
font-size: 14px;
line-height: 1.55;
margin-bottom: 16px;
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

.nav-btn.active { color: #ffcc00; }
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
addToHallOfFame={addToHallOfFame}
hallOfFame={hallOfFame}
t={t}
/>

<div className="swipe-hint">← swipe cards →</div>
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
addToHallOfFame={addToHallOfFame}
hallOfFame={hallOfFame}
t={t}
/>

<div className="swipe-hint">← swipe collection →</div>

<HallOfFameWomen
collection={collection}
hallOfFame={hallOfFame}
addToHallOfFame={addToHallOfFame}
t={t}
/>
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

<div className="swipe-hint">← swipe market →</div>
</div>
)}

{activeTab === "tournament" && (
<div className="screen">
<div className="tournament-intro">
<p className="vault-kicker">FANTASY LEAGUE</p>

<h2 className="vault-title">{t.tournamentsTitle}</h2>

<p className="vault-subtitle">{t.tournamentsText}</p>
</div>

<div className="tournament-list">
<div className="tournament-card">
<div className="tournament-status">{t.liveSoon}</div>

<h3 className="tournament-title">World Cup Fantasy</h3>

<div className="tournament-info">
📍 World Aquatics
<br />
🗓 October 2026
<br />
🏆 10 000 SS + Legend Card
</div>

<button
className="btn btn-gold"
onClick={() => alert(t.enterTeam)}
>
{t.enterTeam}
</button>
</div>

<div className="tournament-card">
<div className="tournament-status">{t.comingSoon}</div>

<h3 className="tournament-title">NCAA Championship</h3>

<div className="tournament-info">
📍 USA
<br />
🗓 March 2026
<br />
🏆 7 500 SS + Legend Card
</div>

<button
className="btn btn-gold"
onClick={() => alert(t.enterTeam)}
>
{t.enterTeam}
</button>
</div>
</div>
</div>
)}

{selectedCard && selectedCard.image && (
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
tab="tournament"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="🏆"
label={t.tournament}
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
addToHallOfFame,
hallOfFame,
t,
}: {
cards: CollectionItem[];
setSelectedCard: (card: Card) => void;
sellCard: (card: CollectionItem) => void;
upgradeCard: (card: CollectionItem) => void;
addToHallOfFame: (legendId: string) => void;
hallOfFame: string[];
t: typeof dictionary.en;
}) {
return (
<div className="scroll-row">
{cards.map((card) => (
<div
key={card.id}
className="card"
style={{ border: `2px solid ${card.color}` }}
onClick={() => {
if (card.image) setSelectedCard(card);
}}
>
{card.image ? (
<img className="card-img" src={card.image} alt={card.name} />
) : (
<div className="legend-placeholder">★</div>
)}

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">
{card.rarity} · x{card.count}
</div>

<div className="actions">
{card.rarity === "Legend" ? (
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
addToHallOfFame(card.id);
}}
>
{hallOfFame.includes(card.id) ? t.inHall : t.addToHall}
</button>
) : (
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
>
{t.upgrade}
</button>
)}

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

function HallOfFameWomen({
collection,
hallOfFame,
addToHallOfFame,
t,
}: {
collection: CollectionItem[];
hallOfFame: string[];
addToHallOfFame: (legendId: string) => void;
t: typeof dictionary.en;
}) {
return (
<>
<div className="hall-intro">
<p className="vault-kicker">LEGEND COLLECTION</p>

<h2 className="vault-title">{t.hallTitle}</h2>

<p className="vault-subtitle">{t.hallText}</p>
</div>

<div className="hall-row">
{legendWomen.map((legend) => {
const ownedLegend = collection.find(
(card) => card.id === legend.id && card.rarity === "Legend"
);

const inHall = hallOfFame.includes(legend.id);

return (
<div
key={legend.id}
className={`hof-card ${inHall ? "unlocked" : ""}`}
>
{!inHall && <div className="hof-lock">🔒</div>}

<div className="hof-silhouette">
{inHall ? "★" : "?"}
</div>

<div className="hof-info">
<div className="hof-kicker">
{inHall ? t.unlocked : t.locked}
</div>

<div className="hof-name">{legend.name}</div>

<div className="hof-country">{legend.country}</div>

<div className="hof-status">
{inHall ? t.inHall : "Legend Slot"}
</div>

{ownedLegend && !inHall && (
<button
className="btn btn-gold"
style={{ marginTop: 10 }}
onClick={() => addToHallOfFame(legend.id)}
>
{t.addToHall}
</button>
)}
</div>
</div>
);
})}
</div>
</>
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


