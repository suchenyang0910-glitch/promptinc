import { cryptoinc } from "./cryptoinc";
import { boxPuzzle } from "./box-puzzle";
import { bubbleShooter } from "./bubble-shooter";
import { brickBlockClassic } from "./brick-block-classic";
import { brickBreaker } from "./brick-breaker";
import { classicMines } from "./classic-mines";
import { coinCatcher } from "./coin-catcher";
import { mergeFruit } from "./merge-fruit";
import { numberMerge } from "./number-merge";
import { colorSort } from "./color-sort";
import { wordConnect } from "./word-connect";
import { memoryFlip } from "./memory-flip";
import { reactionTap } from "./reaction-tap";
import { promptinc } from "./promptinc";
import { retroSnake } from "./retro-snake";
import { retroAirStrike } from "./retro-air-strike";
import { tileMatch } from "./tile-match";

export const games = {
  [promptinc.slug]: promptinc,
  [cryptoinc.slug]: cryptoinc,
  [retroSnake.slug]: retroSnake,
  [brickBlockClassic.slug]: brickBlockClassic,
  [brickBreaker.slug]: brickBreaker,
  [classicMines.slug]: classicMines,
  [tileMatch.slug]: tileMatch,
  [bubbleShooter.slug]: bubbleShooter,
  [coinCatcher.slug]: coinCatcher,
  [retroAirStrike.slug]: retroAirStrike,
  [boxPuzzle.slug]: boxPuzzle,
  [mergeFruit.slug]: mergeFruit,
  [numberMerge.slug]: numberMerge,
  [colorSort.slug]: colorSort,
  [wordConnect.slug]: wordConnect,
  [memoryFlip.slug]: memoryFlip,
  [reactionTap.slug]: reactionTap,
};
