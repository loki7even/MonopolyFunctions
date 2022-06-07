/* eslint-disable */
import { CardType, Passive } from "../Cards/CardsType";
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

  changePlayer(players : PlayerType[], playerPos : number) {
    playerPos += 1;
      if (players.length - 1 < playerPos) playerPos = 0;
    return playerPos;
  }

  checkMove(players : PlayerType[], dices : number[], jailTime : number, playerPos : number) {
    let inJailPlayer;

    if (dices[1] != dices[0]) {
      playerPos = this.changePlayer(players, playerPos);
    } else if(dices[1] == dices[0]) {
      players[playerPos].jailtime--;
    } else if (players[playerPos].jailtime == 0 || players[playerPos] == inJailPlayer) {
      inJailPlayer = players[playerPos];
      inJailPlayer.position = 10;
      inJailPlayer.jailtime++;
      if (inJailPlayer.jailtime == 3) {
        players[playerPos].jailtime = jailTime;
        inJailPlayer = undefined;
      }
      playerPos = this.changePlayer(players, playerPos);
    }

    return playerPos;
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
  
  buy(player: PlayerType, card : Passive) {
    if ((card instanceof Cities || card instanceof Companies) && card.owner == null) {
      if (player.bankAmount - card.cost > 0) {
        card.owner = player;
        player.bankAmount -= card.cost
      } 
    }
  }
  
  sell(player: PlayerType, card : Passive) {
    if ((card instanceof Cities || card instanceof Companies) && card.owner != null) {
      player.bankAmount += card.cost
      card.owner = null;
    }
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