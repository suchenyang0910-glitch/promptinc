import type { GameConfig } from "@/types/game";

import GameClient from "@/components/game/GameClient";

export default function GameEngine({ game }: { game: GameConfig }) {
  return <GameClient config={game} />;
}

