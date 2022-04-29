/* eslint-disable */
import { PlayerType } from "./PlayerType";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function launchdice(nbDice: number): [number[], number] {
  const dice: number[] = [];
  let sum = 0;
  do {
    const rd = randomIntFromInterval(1, 6);
    dice.push(rd);
    sum += rd;
  } while (nbDice-- >= 0);

  return [dice, sum];
}

function movePlayer(player: PlayerType, nbDice: number) {
  return (player.display.position += launchdice(nbDice)[1]);
}

function pay(player: PlayerType, total: number): PlayerType {
  if (player.bankAmount - total > 0) player.bankAmount - total;

  return player;
}

function sell(player: PlayerType, total: number): PlayerType {
  player.bankAmount + total;

  return player;
}

function bid(players: [PlayerType], totalBid: number): [PlayerType] {
  
  return players;
}
