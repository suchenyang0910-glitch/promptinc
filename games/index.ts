import { cryptoinc } from "./cryptoinc";
import { boxPuzzle } from "./box-puzzle";
import { bubbleShooter } from "./bubble-shooter";
import { brickBlockClassic } from "./brick-block-classic";
import { brickBreaker } from "./brick-breaker";
import { classicMines } from "./classic-mines";
import { coinCatcher } from "./coin-catcher";
import { coffeeinc } from "./coffeeinc";
import { mergeFruit } from "./merge-fruit";
import { numberMerge } from "./number-merge";
import { colorSort } from "./color-sort";
import { wordConnect } from "./word-connect";
import { memoryFlip } from "./memory-flip";
import { reactionTap } from "./reaction-tap";
import { promptinc } from "./promptinc";
import { restaurantinc } from "./restaurantinc";
import { retroSnake } from "./retro-snake";
import { retroAirStrike } from "./retro-air-strike";
import { saasinc } from "./saasinc";
import { shippinginc } from "./shippinginc";
import { spaceminerinc } from "./spaceminerinc";
import { tileMatch } from "./tile-match";
import { vpsinc } from "./vpsinc";
import { airportinc } from "./airportinc";
import { gamestudioinc } from "./gamestudioinc";

export const games = {
  [promptinc.slug]: promptinc,
  [cryptoinc.slug]: cryptoinc,
  [coffeeinc.slug]: coffeeinc,
  [spaceminerinc.slug]: spaceminerinc,
  [saasinc.slug]: saasinc,
  [vpsinc.slug]: vpsinc,
  [restaurantinc.slug]: restaurantinc,
  [gamestudioinc.slug]: gamestudioinc,
  [shippinginc.slug]: shippinginc,
  [airportinc.slug]: airportinc,
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
