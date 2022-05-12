/* eslint-disable */
import { PlayerType } from "./PlayerType";

class PlayerActions
{
  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  launchdice(nbDice: number): [number[], number] {
    const dice: number[] = [];
    let sum = 0;
    do {
      const rd = this.randomIntFromInterval(1, 6);
      dice.push(rd);
      sum += rd;
    } while (nbDice-- >= 0);
  
    return [dice, sum];
  }
  
  movePlayer(player: PlayerType, move: number) {
    player.display.position += move;
    return player;
  }
  
  pay(player: PlayerType, total: number): PlayerType {
    if (player.bankAmount - total > 0) player.bankAmount - total;
  
    return player;
  }
  
  sell(player: PlayerType, total: number): PlayerType {
    player.bankAmount + total;
  
    return player;
  }
  
  bid(players: [PlayerType], totalBid: number): [PlayerType] {
    
    return players;
  }
}





export default PlayerActions; 