import cryptoinc from "@/content/games/cryptoinc.json";
import promptinc from "@/content/games/promptinc.json";

import type { GameContentV1 } from "@/lib/gameContentV1";

export const gameContentV1 = {
  promptinc: promptinc as unknown as GameContentV1,
  cryptoinc: cryptoinc as unknown as GameContentV1,
};
