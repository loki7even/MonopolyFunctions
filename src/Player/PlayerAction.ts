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

  constructor(player: PlayerType, cards : Array<CardType>, inJail:boolean, startAmount:number) {
    this.player = player;
    this.cards = cards;
    this.inJail = inJail;
    this.startAmount = startAmount;
  }

  turn(dices: number, allCardsOwned : boolean) {
    let launch =  this.launchdice(dices);

    this.player = this.movePlayer(launch[1], this.cards.length-1, this.startAmount);

    let cards = this.cards.filter((card) => {
      return card.position == this.player.position;
    })
    
    if(cards.length!=1) throw new Error("Too many cards");
    
    this.card = cards[0];

    if(this.card instanceof Actions) this.actionCard(this.card);

    if(this.card instanceof Passive && this.card.owner != null) this.rent(this.card , this.card.propreties, dices, allCardsOwned);

    return [launch[0], this.player, this.card];
  }

  changePlayer(players : PlayerType[], playerPos : number, lock : boolean) {
    playerPos += 1;
    if (players.length - 1 < playerPos) playerPos = 0;
    lock = false;
    return playerPos;
  }

  checkMove(players : PlayerType[], dices : number[], playerPos : number, lock : boolean, owner? : PlayerType) {
    if (dices[1] != dices[0] && lock) {
      this.player.jailTime = 3;
      playerPos = this.changePlayer(players, playerPos, lock);
    } else if(dices[1] == dices[0] && lock) {
      this.player.jailTime --;
    }
    if (this.player.jailTime == 0) {
      this.player.inJail = true;
      this.player.position = 10;
      playerPos = this.changePlayer(players, playerPos, lock);
    }
    return playerPos;
  }

  checkJail(players : PlayerType[], dices : number, playerPos : number, lock : boolean, action : string, launch? : number[], card? : Prison) {
    console.log(launch);
    console.log(this.jailFee(50, action, card));
    if (launch) {
      if (launch[0] == launch[1] && this.player.jailTime < 3) {
        this.player.inJail = false;
        this.player.jailTime = 3;
        this.player = this.movePlayer(launch[1], this.cards.length-1, this.startAmount);
        return lock = false;
      }
      if (this.player.jailTime < 3) this.player.jailTime ++;
      if ((this.player.jailTime == 3 && this.jailFee(50, action, card)) || (this.player.jailTime == 3 && this.player.inJail && this.jailFee(50, action, card))) {
        this.player.inJail = false;
        this.player = this.movePlayer(launch[1], this.cards.length-1, this.startAmount);
        return lock = false;
      }
    }
    playerPos = this.changePlayer(players, playerPos, lock);
    return lock = true;
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
      if (card instanceof Companies && card.propreties < card.multiplier.length && !card.bought) {
        card.propreties += 1;
        card.bought = true;
      }
      card.owner = this.player;
      this.player.bankAmount -= card.cost;
    }
  }

  upgrade(card : Passive) {
    if (card.owner == this.player && this.player.bankAmount - card.cost > 0) {
      if (card instanceof Cities && card.propreties < card.rent.length) {
        if (card.propreties == 4) this.player.bankAmount -= 4*card.buildCost;
        this.player.bankAmount -= card.buildCost;
      }
      card.propreties += 1;
    }
  }
  
  sellProperty(card : Passive) {
    if (card.owner == this.player && card.propreties == 0) {
      this.player.bankAmount += card.cost;
      card.owner = null;
    }
  }
  
  sellBuilding(card : Passive) {
    if (card.owner == this.player && card.propreties != 0) {
      if (card instanceof Cities) {
        if (card.propreties == 5) this.player.bankAmount += 4*(card.buildCost/2);
        this.player.bankAmount += card.buildCost/2;
      }
      card.propreties--;
    }
  }

  sellAllBuildings(cardColor : string) {
    this.cards.forEach(card =>{
      if (card instanceof Cities && cardColor == card.color) {
        while (card.propreties != 0) {
          this.sellBuilding(card);
        }
      }
    })
  }

  mortage(card : Passive, allCardsOwned : boolean){
    if (card.owner != null && allCardsOwned && !card.mortage) {
      card.mortage = true;
      this.player.bankAmount += card.cost / 2;
    }
  }

  unMortage(card : Passive) {
    if (card.mortage) {
      card.mortage = false;
      this.player.bankAmount -= ((card.cost/2) + ((card.cost/2)*0.1));
    }
  }
  
  rent(card : Passive, amount : number, dices : number, allCardsOwned : boolean) {
    if (card.owner != null && card.owner != this.player && !card.mortage) {
      if (card instanceof Cities && this.player.bankAmount - card.rent[amount] > 0) {
        this.player.bankAmount -= (allCardsOwned ? 2*card.rent[amount] : card.rent[amount]);
        card.owner.bankAmount += (allCardsOwned ? 2*card.rent[amount] : card.rent[amount]);
      }
      if (card instanceof Companies && this.player.bankAmount - dices*card.multiplier[amount] > 0) {
        if (amount <= card.multiplier.length && card.multiplier.length == 3) {
          this.player.bankAmount -= dices*card.multiplier[amount];
          card.owner.bankAmount += dices*card.multiplier[amount];
        }
        if (amount <= card.multiplier.length && card.multiplier.length == 5) {
          this.player.bankAmount -= 25*card.multiplier[amount];
          card.owner.bankAmount += 25*card.multiplier[amount];
        }
      }
    }
  }
  
  jailFee(amount : number, action : string, card? : Prison){
    let paid = false;
    switch (action) {
      case "jailFee":
        this.player.inJail = false;
        this.player.jailTime = 3;
        this.player.bankAmount -= amount;
        paid = true;
        break;
      case "use card":
        this.player.inJail = false;
        this.player.jailTime = 3;
        card?.players.forEach( player => {
          if (player = this.player) {
            player;
          }
        });
        paid = true;
        break;
      }
    return paid;
  }

  auction(card : Passive, players: [PlayerType], totalBid: number, ) {
    if (card.owner != null) {
      totalBid
    }
    return totalBid;
  }

  loan() {

  }

  bankrupt() {

  }

  actionCard(card : Actions) {

  }
}

export default PlayerActions; 