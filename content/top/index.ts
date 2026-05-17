import ai_startup_games from "@/content/top/ai-startup-games.json";
import best_ai_games from "@/content/top/best-ai-games.json";
import best_idle_games from "@/content/top/best-idle-games.json";
import best_retro_arcade_games from "@/content/top/best-retro-arcade-games.json";
import best_simulator_games from "@/content/top/best-simulator-games.json";
import best_startup_games from "@/content/top/best-startup-games.json";
import business_tycoon_games from "@/content/top/business-tycoon-games.json";
import free_business_games from "@/content/top/free-business-games.json";
import free_clicker_games from "@/content/top/free-clicker-games.json";

import type { TopContentV1 } from "@/lib/top";

export const topContentV1: TopContentV1[] = [
  ai_startup_games as unknown as TopContentV1,
  best_ai_games as unknown as TopContentV1,
  best_idle_games as unknown as TopContentV1,
  best_retro_arcade_games as unknown as TopContentV1,
  best_simulator_games as unknown as TopContentV1,
  best_startup_games as unknown as TopContentV1,
  business_tycoon_games as unknown as TopContentV1,
  free_business_games as unknown as TopContentV1,
  free_clicker_games as unknown as TopContentV1,
];
