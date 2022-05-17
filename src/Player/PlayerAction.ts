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
    while (nbDice > 0) {
      const rd = this.randomIntFromInterval(1, 6);
      dice.push(rd);
      sum += rd;
      nbDice--;
    };
  
    return [dice, sum];
  }
  
  movePlayer(player: PlayerType, move: number, lenBoard: number) {
    
    player.position += move;
    if(player.position > lenBoard) {
      player.position -= lenBoard
    }
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