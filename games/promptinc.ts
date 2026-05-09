import type { GameConfig } from "@/types/game";

export const promptinc: GameConfig = {
  slug: "promptinc",
  gameType: "idle",
  gameName: "PromptInc",
  description: "Build your AI startup empire.",
  shortDescription: "Build an AI startup empire.",
  category: "AI Startup",
  emoji: "🤖",
  currencyName: "Valuation",
  clickButtonText: "Generate Prompt",
  luck: {
    enabled: true,
    criticalChance: 0.05,
    criticalMultiplier: 10,
    luckyNames: ["Lucky Prompt", "Viral AI Post", "Investor Boost", "GPU Jackpot"],
  },
  milestones: [
    { money: 1000, title: "First $1K" },
    { money: 10000, title: "Seed Round" },
    { money: 100000, title: "Series A" },
    { money: 1000000, title: "AI Unicorn" },
  ],
  upgrades: [
    { id: "prompt_engineer", name: "Prompt Engineer", baseCost: 50, income: 1 },
    { id: "gpu_cluster", name: "GPU Cluster", baseCost: 300, income: 8 },
    { id: "ai_agent", name: "AI Agent", baseCost: 1500, income: 35 },
    { id: "agi_lab", name: "AGI Lab", baseCost: 10000, income: 200 },
  ],
};
