import type { GameConfig } from "@/types/game";

export const cryptoinc: GameConfig = {
  slug: "cryptoinc",
  gameType: "idle",
  gameName: "CryptoInc",
  description: "Build your crypto empire.",
  shortDescription: "Build a crypto empire.",
  category: "Crypto",
  emoji: "₿",
  currencyName: "Market Cap",
  clickButtonText: "Mine Crypto",
  luck: {
    enabled: true,
    criticalChance: 0.08,
    criticalMultiplier: 15,
    luckyNames: ["Whale Pump", "Meme Explosion", "Exchange Listing", "Viral Token"],
  },
  milestones: [
    { money: 1000, title: "First Wallet" },
    { money: 10000, title: "Seed Investor" },
    { money: 100000, title: "Token Launch" },
    { money: 1000000, title: "Listed Exchange" },
  ],
  upgrades: [
    { id: "gpu_miner", name: "GPU Miner", baseCost: 50, income: 1 },
    { id: "staking_pool", name: "Staking Pool", baseCost: 300, income: 8 },
    { id: "crypto_bot", name: "Crypto Bot", baseCost: 1500, income: 35 },
    { id: "exchange", name: "Exchange", baseCost: 10000, income: 200 },
  ],
};
