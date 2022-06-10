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
  inJail: boolean;
  startAmount: number;
  inJailPlayer?: PlayerType;

  constructor(player: PlayerType, cards : Array<CardType>, inJail:boolean, startAmount:number) {
    this.player = player;
    this.cards = cards;
    this.inJail = inJail;
    this.startAmount = startAmount;
  }

  turn(dices: number) {
    let lauch =  this.launchdice(dices);

    this.player = this.movePlayer(this.player, lauch[1], this.cards.length-1, this.startAmount);

    let cards = this.cards.filter((card) => {
      return card.position == this.player.position;
    })
    
    if(cards.length!=1) throw new Error("Too many cards");
    
    this.card = cards[0];

    if(this.card as Actions) this.card = this.card as Actions;

    return [lauch[0], this.player, this.card];
  }

  changePlayer(players : PlayerType[], playerPos : number, lock : boolean) {
    playerPos += 1;
    if (players.length - 1 < playerPos) playerPos = 0;
    lock = false;
    return playerPos;
  }

  checkMove(players : PlayerType[], dices : number[], playerPos : number, lock : boolean) {
    if (dices[1] != dices[0] && lock && players[playerPos].inJail == false) {
      players[playerPos].jailTime = 3;
      playerPos = this.changePlayer(players, playerPos, lock);
    } else if(dices[1] == dices[0] && lock && players[playerPos].inJail == false) {
      players[playerPos].jailTime -= 1;
      console.log(players[playerPos].jailTime);
    }
    if (players[playerPos].jailTime == 0 || players[playerPos].inJail == true) {
      this.inJailPlayer = players[playerPos];
      this.inJailPlayer.inJail = true;
      this.inJailPlayer.position = 10;
      this.inJailPlayer.jailTime ++;
      playerPos = this.changePlayer(players, playerPos, lock);
      console.log(this.inJailPlayer.jailTime, this.inJailPlayer);
      if (this.inJailPlayer.jailTime == 3) {
        this.inJailPlayer.inJail = false;
      }
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
    if (card.owner == null) {
      if (player.bankAmount - card.cost > 0) {
        card.owner = player;
        player.bankAmount -= card.cost
      } 
    }
  }

  upgrade(player: PlayerType, card : Passive, allCardsOwned : boolean) {
    if (card.owner == player && allCardsOwned && player.bankAmount - card.cost > 0) {
      card.propreties += 1;
      if (card instanceof Cities) player.bankAmount -= card.buildingCost;
      if (card instanceof Companies) player.bankAmount -= card.cost;
    }
  }
  
  sell(player: PlayerType, card : Passive) {
    if (card.owner != null) {
      player.bankAmount += card.cost
      card.owner = null;
    }
  }
  
  mortage(player: PlayerType, card : Passive){
    if (card.owner != null) {
      card.mortage = true;
      player.bankAmount += card.cost / 2;
    }
  }

  auction(players: [PlayerType], totalBid: number, player: PlayerType, card : Passive): [PlayerType] {
    if (card.owner != null) {
      card.mortage = true;
      // card.
    }
    return players;
  }

  rent(player: PlayerType, card : Passive, amount : number, dices : number) {
    if (card.owner != null && card.owner != player) {
      if (card instanceof Cities && player.bankAmount - card.rent[amount] > 0) {
        player.bankAmount -= card.rent[amount];
        card.owner.bankAmount += card.rent[amount];
      }
      if (card instanceof Companies && player.bankAmount - dices*card.multiplier[amount] > 0) {
        if (amount <= card.multiplier.length ) player.bankAmount -= dices*card.multiplier[amount];
      }
    }
  }
}

export default PlayerActions; 