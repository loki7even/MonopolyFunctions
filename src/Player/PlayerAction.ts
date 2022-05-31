/* eslint-disable */
import { CardType } from "../Cards/CardsType";
import { Cities } from "../Cards/Cities";
import { Companies } from "../Cards/Companies";
import { Actions } from "../Cards/Actions";
import { Prison } from "../Cards/Prison";
import { PlayerType } from "./PlayerType";

class PlayerActions {
  player: PlayerType;
  cards: CardType[];
  card: CardType | undefined;
  jailtime: number;
  startAmount: number;

  constructor(player: PlayerType, cards : Array<CardType>, jailtime:number, startAmount:number) {
    this.player = player;
    this.cards = cards;
    this.jailtime = jailtime
    this.startAmount = startAmount
  }

  turn(dices: number) {
    let lauch =  this.launchdice(dices)

    this.player = this.movePlayer(this.player, lauch[1], this.cards.length-1, this.startAmount)

    let cards = this.cards.filter((card) => {
        return card.position == this.player.position  
    })
    
    if(cards.length!=1) throw new Error("Too many cards");
    
    this.card = cards[0]

    if(this.card as Actions) this.card = this.card as Actions; 
    
    return [lauch[0], this.player, this.card]
  }

  checkMove(players : PlayerType[], dices : number[], jailTime : number, position : number) {
    let inJailPlayer;

    if (dices[1] != dices[0] && players[position].jailtime != 0 && players != inJailPlayer) 
    {
      position += 1;
      if (players.length - 1 < position)
        position = 0;
    } else if(dices[1] == dices[0] && players[position].jailtime != 0 && players[position] != inJailPlayer) 
    {
      players[position].jailtime--;
    } else if (players[position].jailtime == 0 || players[position] == inJailPlayer)
    {
      inJailPlayer = players[position];
      inJailPlayer.position = 10;
      inJailPlayer.jailtime++;
      if (inJailPlayer.jailtime == 3) {
        players[position].jailtime = jailTime;
        inJailPlayer = undefined;
      }
      position += 1;
      if (players.length - 1 < position)
        position = 0;
    }
  }

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
  
  movePlayer(player: PlayerType, move: number, lenBoard: number, startAmount: number) {
    
    player.position += move;
    if(player.position > lenBoard) {
      player.position -= lenBoard
      player.bankAmount += startAmount
    }
    return player;
  }
  
  buy(player: PlayerType, total: number): PlayerType {
    if (player.bankAmount - total > 0) player.bankAmount -= total;
  
    return player;
  }
  
  sell(player: PlayerType, total: number): PlayerType {
    player.bankAmount + total;
  
    return player;
  }
  
  bid(players: [PlayerType], totalBid: number): [PlayerType] {
    
    return players;
  }

  // getPropreties(player: PlayerType, cards : [CardType]) {
  //   cards.filter(card => {
  //     if(card instanceof Cities) {
  //       let card2 = card as Cities
  //       return card2.owner == player
  //     } else if(card instanceof Companies) 
  //     {
  //       let card2 = card as Companies
  //       return card2.owner == player
  //     }
  //     return false
  //   })
  // }
}

export default PlayerActions; 