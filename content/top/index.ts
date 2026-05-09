import aiStartupGames from "@/content/top/ai-startup-games.json";
import bestIdleGames from "@/content/top/best-idle-games.json";
import bestRetroArcadeGames from "@/content/top/best-retro-arcade-games.json";
import businessTycoonGames from "@/content/top/business-tycoon-games.json";
import freeClickerGames from "@/content/top/free-clicker-games.json";

import type { TopContentV1 } from "@/lib/top";

export const topContentV1: TopContentV1[] = [
  bestIdleGames as unknown as TopContentV1,
  businessTycoonGames as unknown as TopContentV1,
  aiStartupGames as unknown as TopContentV1,
  freeClickerGames as unknown as TopContentV1,
  bestRetroArcadeGames as unknown as TopContentV1,
];

