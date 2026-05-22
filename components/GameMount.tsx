"use client";

import type { GameConfig, GameType } from "@/types/game";

import GameEngine from "@/components/GameEngine";
import SnakeGame from "@/components/SnakeGame";
import AirStrikeGame from "@/components/retro/AirStrikeGame";
import BoxPuzzleGame from "@/components/retro/BoxPuzzleGame";
import BrickBreakerGame from "@/components/retro/BrickBreakerGame";
import BubbleShooterGame from "@/components/retro/BubbleShooterGame";
import CoinCatcherGame from "@/components/retro/CoinCatcherGame";
import ColorSortGame from "@/components/retro/ColorSortGame";
import MemoryFlipGame from "@/components/retro/MemoryFlipGame";
import MergeFruitGame from "@/components/retro/MergeFruitGame";
import MinesGame from "@/components/retro/MinesGame";
import NumberMergeGame from "@/components/retro/NumberMergeGame";
import ReactionTapGame from "@/components/retro/ReactionTapGame";
import SkyHopGame from "@/components/retro/SkyHopGame";
import TetrisGame from "@/components/retro/TetrisGame";
import TileMatchGame from "@/components/retro/TileMatchGame";
import MeteorDodgeGame from "@/components/retro/MeteorDodgeGame";
import WordConnectGame from "@/components/retro/WordConnectGame";

export default function GameMount({ game }: { game: GameConfig }) {
  const renderers: Record<GameType, React.ReactElement> = {
    idle: <GameEngine game={game} />,
    snake: <SnakeGame game={game} />,
    tetris: <TetrisGame game={game} />,
    brick_breaker: <BrickBreakerGame game={game} />,
    mines: <MinesGame game={game} />,
    tile_match: <TileMatchGame game={game} />,
    bubble_shooter: <BubbleShooterGame game={game} />,
    coin_catcher: <CoinCatcherGame game={game} />,
    air_strike: <AirStrikeGame game={game} />,
    box_puzzle: <BoxPuzzleGame game={game} />,
    merge_fruit: <MergeFruitGame game={game} />,
    number_merge: <NumberMergeGame game={game} />,
    color_sort: <ColorSortGame game={game} />,
    word_connect: <WordConnectGame game={game} />,
    memory_flip: <MemoryFlipGame game={game} />,
    reaction_tap: <ReactionTapGame game={game} />,
    sky_hop: <SkyHopGame game={game} />,
    meteor_dodge: <MeteorDodgeGame game={game} />,
  };

  return renderers[game.gameType];
}
