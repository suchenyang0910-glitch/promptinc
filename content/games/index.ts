import cryptoinc from "@/content/games/cryptoinc.json";
import airportinc from "@/content/games/airportinc.json";
import coffeeinc from "@/content/games/coffeeinc.json";
import gamestudioinc from "@/content/games/gamestudioinc.json";
import promptinc from "@/content/games/promptinc.json";
import restaurantinc from "@/content/games/restaurantinc.json";
import saasinc from "@/content/games/saasinc.json";
import shippinginc from "@/content/games/shippinginc.json";
import spaceminerinc from "@/content/games/spaceminerinc.json";
import vpsinc from "@/content/games/vpsinc.json";

import type { GameContentV1 } from "@/lib/gameContentV1";

export const gameContentV1 = {
  promptinc: promptinc as unknown as GameContentV1,
  cryptoinc: cryptoinc as unknown as GameContentV1,
  coffeeinc: coffeeinc as unknown as GameContentV1,
  spaceminerinc: spaceminerinc as unknown as GameContentV1,
  saasinc: saasinc as unknown as GameContentV1,
  vpsinc: vpsinc as unknown as GameContentV1,
  restaurantinc: restaurantinc as unknown as GameContentV1,
  gamestudioinc: gamestudioinc as unknown as GameContentV1,
  shippinginc: shippinginc as unknown as GameContentV1,
  airportinc: airportinc as unknown as GameContentV1,
};
