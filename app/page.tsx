"use client";

import { useEffect, useState } from "react";
import { initTelegram } from "./telegram";

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

type TelegramUser = {
id?: number;
username?: string;
first_name?: string;
last_name?: string;
};

const allCards: Card[] = [
{
id: "evans",
serial: "#124/500",
name: "Angharad Evans",
image: "/evans-card.png",
rarity: "Rare",
color: "border-blue-400",
},
{
id: "steenbergen",
serial: "#088/500",
name: "Marrit Steenbergen",
image: "/steenbergen-card.png",
rarity: "Rare",
color: "border-cyan-400",
},
{
id: "douglass",
serial: "#041/100",
name: "Kate Douglass",
image: "/douglass-card.png",
rarity: "Elite",
color: "border-purple-400",
},
{
id: "marchand",
serial: "#03/25",
name: "Leon Marchand",
image: "/leon-card.png",
rarity: "GOAT",
color: "border-yellow-400",
},
{
id: "summer",
serial: "#01/25",
name: "Summer McIntosh",
image: "/summer-card.png",
rarity: "GOAT",
color: "border-yellow-400",
},
];

function pickCardByOdds(): Card {
const roll = Math.random() * 100;

let rarity: Rarity;

if (roll < 60) {
rarity = "Rare";
} else if (roll < 90) {
rarity = "Elite";
} else {
rarity = "GOAT";
}

const pool = allCards.filter((card) => card.rarity === rarity);
return pool[Math.floor(Math.random() * pool.length)];
}

function generatePack() {
const pack: Card[] = [];

for (let i = 0; i < 5; i++) {
pack.push(pickCardByOdds());
}

return pack;
}

function addCardsToCollection(
currentCollection: CollectionItem[],
newCards: Card[]
): CollectionItem[] {
const updated = [...currentCollection];

newCards.forEach((card) => {
const existingCard = updated.find((item) => item.id === card.id);

if (existingCard) {
existingCard.count += 1;
} else {
updated.push({ ...card, count: 1 });
}
});

return updated;
}

function getSellPrice(rarity: Rarity) {
if (rarity === "Rare") return 100;
if (rarity === "Elite") return 300;
return 1000;
}

export default function Home() {
const [opening, setOpening] = useState(false);
const [packCards, setPackCards] = useState<Card[]>([]);
const [collection, setCollection] = useState<CollectionItem[]>([]);
const [marketCards, setMarketCards] = useState<MarketCard[]>([]);
const [coins, setCoins] = useState(500);
const [activeTab, setActiveTab] = useState("home");
const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

useEffect(() => {
const tg = initTelegram();

if (tg?.initDataUnsafe?.user) {
setTelegramUser(tg.initDataUnsafe.user);
}

const savedCollection = localStorage.getItem("swimskills_collection");
const savedCoins = localStorage.getItem("swimskills_coins");
const savedMarket = localStorage.getItem("swimskills_market");

if (savedCollection) {
setCollection(JSON.parse(savedCollection));
}

if (savedCoins) {
setCoins(Number(savedCoins));
}

if (savedMarket) {
setMarketCards(JSON.parse(savedMarket));
}
}, []);

useEffect(() => {
localStorage.setItem("swimskills_collection", JSON.stringify(collection));
}, [collection]);

useEffect(() => {
localStorage.setItem("swimskills_coins", String(coins));
}, [coins]);

useEffect(() => {
localStorage.setItem("swimskills_market", JSON.stringify(marketCards));
}, [marketCards]);

function openPack() {
setOpening(true);

setTimeout(() => {
const newPack = generatePack();

setPackCards(newPack);
setCollection((prev) => addCardsToCollection(prev, newPack));
setCoins((prev) => prev + 25);

setOpening(false);
}, 2000);
}

function upgradeCard(card: CollectionItem) {
let nextRarity: Rarity | null = null;
let cost = 0;

if (card.rarity === "Rare") {
nextRarity = "Elite";
cost = 100;
} else if (card.rarity === "Elite") {
nextRarity = "GOAT";
cost = 300;
}

if (!nextRarity) return;

if (card.count < 2) {
alert("Need 2 duplicate cards");
return;
}

if (coins < cost) {
alert("Not enough SS Coins");
return;
}

const pool = allCards.filter((c) => c.rarity === nextRarity);
const reward = pool[Math.floor(Math.random() * pool.length)];

setCoins((prev) => prev - cost);

setCollection((prev) => {
const updated = prev
.map((item) => {
if (item.id === card.id) {
return {
...item,
count: item.count - 2,
};
}

return item;
})
.filter((item) => item.count > 0);

return addCardsToCollection(updated, [reward]);
});

alert(`UPGRADED → ${reward.name}`);
}

function sellCard(card: CollectionItem) {
const sellPrice = getSellPrice(card.rarity);

setCoins((prev) => prev + sellPrice);

setMarketCards((prev) => [
...prev,
{
...card,
price: sellPrice,
},
]);

setCollection((prev) =>
prev
.map((item) => {
if (item.id === card.id) {
return {
...item,
count: item.count - 1,
};
}

return item;
})
.filter((item) => item.count > 0)
);

alert(`SOLD → ${card.name} for ${sellPrice} SS`);
}

function buyCard(card: MarketCard, index: number) {
if (coins < card.price) {
alert("Not enough SS Coins");
return;
}

setCoins((prev) => prev - card.price);

setCollection((prev) => addCardsToCollection(prev, [card]));

setMarketCards((prev) => prev.filter((_, i) => i !== index));

alert(`BOUGHT → ${card.name}`);
}

return (
<main className="min-h-screen bg-black text-white pb-32 pt-16">
<div className="sticky top-0 z-50 bg-black border-b border-yellow-400/20 p-4 flex justify-between items-center">
<div>
<h1 className="text-2xl font-black text-yellow-400">Swim Skills</h1>

<p className="text-xs text-gray-400">
{telegramUser
? `@${telegramUser.username || telegramUser.first_name}`
: "Aquatic Stars 2026"}
</p>
</div>

<div className="rounded-full border border-yellow-400 px-4 py-2 text-yellow-400 font-bold">
{coins} SS
</div>
</div>

{activeTab === "home" && (
<div className="p-6">
<div className="flex flex-col items-center justify-center min-h-[70vh]">
{!opening ? (
<button
onClick={openPack}
className="bg-yellow-400 text-black px-10 py-5 rounded-2xl text-2xl font-black hover:scale-105 transition"
>
Open Starter Pack
</button>
) : (
<div className="w-72 h-[420px] rounded-3xl border-4 border-yellow-400 bg-gradient-to-b from-yellow-500 to-black shadow-[0_0_80px_rgba(250,204,21,0.8)] flex items-center justify-center animate-pulse">
<div className="text-center">
<div className="text-6xl font-black text-black">SS</div>
<div className="mt-6 text-2xl font-bold">OPENING...</div>
</div>
</div>
)}
</div>

{packCards.length > 0 && (
<>
<h2 className="text-3xl font-black text-yellow-400 mb-8 text-center">
Your Pack
</h2>

<div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
{packCards.map((card, index) => (
<div
key={`${card.id}-${index}`}
className={`rounded-3xl border-4 ${card.color} overflow-hidden shadow-2xl`}
>
<img src={card.image} alt={card.name} className="w-full" />

<div className="p-4 bg-black">
<h3 className="font-bold text-sm">{card.name}</h3>
<p className="text-xs text-gray-400">{card.serial}</p>
<p className="text-xs text-yellow-300">{card.rarity}</p>
</div>
</div>
))}
</div>
</>
)}
</div>
)}

{activeTab === "collection" && (
<div className="p-6">
<h2 className="text-4xl font-black text-yellow-400 mb-10 text-center">
My Collection
</h2>

{collection.length === 0 ? (
<p className="text-center text-gray-400">
Your collection is empty. Open a starter pack first.
</p>
) : (
<div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
{collection.map((card) => (
<div
key={card.id}
className={`relative rounded-3xl border-4 ${card.color} overflow-hidden shadow-xl`}
>
<img src={card.image} alt={card.name} className="w-full" />

<div className="absolute top-3 right-3 bg-yellow-400 text-black rounded-full px-3 py-1 font-black">
x{card.count}
</div>

<div className="p-4 bg-black">
<h3 className="font-bold text-sm">{card.name}</h3>
<p className="text-xs text-gray-400">{card.serial}</p>

<p className="text-xs text-yellow-300 mb-4">
{card.rarity}
</p>

{(card.rarity === "Rare" || card.rarity === "Elite") && (
<button
onClick={() => upgradeCard(card)}
className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold text-sm hover:scale-105 transition"
>
Upgrade
</button>
)}

<button
onClick={() => sellCard(card)}
className="w-full mt-2 border border-yellow-400 text-yellow-400 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 hover:text-black transition"
>
Sell for {getSellPrice(card.rarity)} SS
</button>
</div>
</div>
))}
</div>
)}
</div>
)}

{activeTab === "market" && (
<div className="p-6">
<h2 className="text-4xl font-black text-yellow-400 mb-10 text-center">
Marketplace
</h2>

{marketCards.length === 0 ? (
<p className="text-center text-gray-400">No cards listed yet</p>
) : (
<div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
{marketCards.map((card, index) => (
<div
key={`${card.id}-${index}`}
className={`rounded-3xl border-4 ${card.color} overflow-hidden shadow-xl`}
>
<img src={card.image} alt={card.name} className="w-full" />

<div className="p-4 bg-black">
<h3 className="font-bold text-sm">{card.name}</h3>
<p className="text-xs text-gray-400">{card.serial}</p>

<p className="text-xs text-yellow-300 mb-4">
{card.rarity}
</p>

<p className="text-sm text-yellow-400 font-bold mb-4">
{card.price} SS
</p>

<button
onClick={() => buyCard(card, index)}
className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold text-sm hover:scale-105 transition"
>
Buy
</button>
</div>
</div>
))}
</div>
)}
</div>
)}

<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-400/20 p-4 flex justify-around">
<button
onClick={() => setActiveTab("home")}
className={`font-bold ${
activeTab === "home" ? "text-yellow-400" : "text-gray-500"
}`}
>
HOME
</button>

<button
onClick={() => setActiveTab("collection")}
className={`font-bold ${
activeTab === "collection" ? "text-yellow-400" : "text-gray-500"
}`}
>
COLLECTION
</button>

<button
onClick={() => setActiveTab("market")}
className={`font-bold ${
activeTab === "market" ? "text-yellow-400" : "text-gray-500"
}`}
>
MARKET
</button>
</div>
</main>
);
}

