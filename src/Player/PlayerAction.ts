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

    this.player = this.movePlayer(lauch[1], this.cards.length-1, this.startAmount);

    let cards = this.cards.filter((card) => {
      return card.position == this.player.position;
    })
    
    if(cards.length!=1) throw new Error("Too many cards");
    
    this.card = cards[0];

    if(this.card as Actions) this.card = this.card as Actions;

    if(this.card instanceof Passive && this.card.owner != null) this.rent(this.card , this.card.propreties, dices);

    return [lauch[0], this.player, this.card];
  }

  changePlayer(players : PlayerType[], playerPos : number, lock : boolean) {
    playerPos += 1;
    if (players.length - 1 < playerPos) playerPos = 0;
    lock = false;
    return playerPos;
  }

  checkMove(players : PlayerType[], dices : number[], playerPos : number, lock : boolean) {
    if (dices[1] != dices[0] && lock && this.player.inJail == false) {
      this.player.jailTime = 3;
      playerPos = this.changePlayer(players, playerPos, lock);
    } else if(dices[1] == dices[0] && lock && this.player.inJail == false) {
      this.player.jailTime -= 1;
      console.log(this.player.jailTime);
    }
    if (this.player.jailTime == 0 || this.player == this.inJailPlayer) {
      this.inJailPlayer = this.player;
      this.inJailPlayer.inJail = true;
      this.inJailPlayer.position = 10;
      if (this.player.jailTime == 0) {
        this.inJailPlayer.jailTime ++;
        playerPos = this.changePlayer(players, playerPos, lock);
      }
      this.inJailPlayer.jailTime ++;
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
  
  movePlayer(move: number, lenBoard: number, startAmount: number) {
    
    this.player.position += move;
    if(this.player.position > lenBoard || this.player.position == 0) {
      this.player.position -= lenBoard
      this.player.bankAmount += startAmount
    }
    return this.player;
  }
  
  buy(card : Passive) {
    if (card.owner == null && this.player.bankAmount - card.cost > 0) {
      card.owner = this.player;
      this.player.bankAmount -= card.cost;
      if (card instanceof Cities) console.log(card.buildCost);
    }
  }

  upgrade(card : Passive, allCardsOwned : boolean) {
    console.log(allCardsOwned);
    if (card.owner == this.player && allCardsOwned && this.player.bankAmount - card.cost > 0) {
      card.propreties += 1;
      if (card instanceof Cities) this.player.bankAmount -= card.buildCost;
      if (card instanceof Companies) this.player.bankAmount -= card.cost;
    }
  }
  
  sell(card : Passive) {
    if (card.owner != null) {
      this.player.bankAmount += card.cost
      card.owner = null;
    }
  }
  
  mortage(card : Passive){
    if (card.owner != null) {
      card.mortage = true;
      this.player.bankAmount += card.cost / 2;
    }
  }

  auction(card : Passive, players: [PlayerType], totalBid: number, ): [PlayerType] {
    if (card.owner != null) {
      card.mortage = true;
      // card.
    }
    return players;
  }

  rent(card : Passive, amount : number, dices : number) {
    if (card.owner != null && card.owner != this.player) {
      if (card instanceof Cities && this.player.bankAmount - card.rent[amount] > 0) {
        this.player.bankAmount -= card.rent[amount];
        card.owner.bankAmount += card.rent[amount];
      }
      if (card instanceof Companies && this.player.bankAmount - dices*card.multiplier[amount] > 0) {
        if (amount <= card.multiplier.length ) this.player.bankAmount -= dices*card.multiplier[amount];
      }
    }
  }

  jailFee(amount : number, action : string, card? : Prison){
    switch (action) {
      case "jailFee":
        this.player.inJail = false;
        this.player.jailTime = 3;
        this.player.bankAmount -= amount;
        break;
      case "use card":
        card?.players.pop();
        break;
    }
  }
}

export default PlayerActions; 