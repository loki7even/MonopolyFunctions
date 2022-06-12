import Cards from "./Cards";
import { Actions } from "./Cards/Actions";
import { CardType, Passive } from "./Cards/CardsType";
import { Cities } from "./Cards/Cities";
import { Companies } from "./Cards/Companies";
import { Prison } from "./Cards/Prison";
import { PlayerType } from "./Player";
import PlayerActions from "./Player/PlayerAction";

export class Game {
  players: PlayerType[] = [];
  cards: CardType[] = [];
  
  playerIndex: number = 0;
  ndBices: number;
  center: number = 0;
  startAmount: number;
  inJail: boolean;
  lock: boolean = true;
  turnData!: (PlayerType | CardType | number[])[];
  prisonLaunch?: number[];
  owner?: PlayerType;

  constructor(players: Array<any> | string,
              cards: Array<any> = Cards.Cards_json,
              bankAmount = 1500, 
              ndbices: number = 2, 
              startAmount: number = 200, 
              inJail:boolean = false, ...partyParam: any) {
              
    this.intiPlayers((players as string ? JSON.parse(players as string): players ), bankAmount);
    this.initCards(cards);
    this.ndBices = ndbices;
    this.startAmount = startAmount;
    this.inJail = inJail;
  }

  intiPlayers(players: Array<any>, bankAmount: number) {
    
    players.forEach((player) => {
      
      let playerObj : PlayerType = {
        name: (player as string ? JSON.parse(player): player ).name,
        bankAmount: bankAmount,
        position: 0,
        inJail: false,
        jailTime: 3,
        ia: player.ia
      }
      this.players.push(playerObj)
    })

  }

  initCards(cards: Array<any>): void {
    
    cards.forEach(card => {

      let cardObj: CardType | null = null;
      
      switch (card.type) {
        case "action":
          cardObj = new Actions(card.name, 
                              card.actionType, 
                              card.description,
                              card.pos)
          break;

        case "cities":
          cardObj = new Cities(card.name, 
                            card.cost, 
                            card.rent, 
                            card.color,
                            card.buildCost,
                            card.mortage,
                            card.pos,
                            card.owner)
          break;
        case "prison":
          cardObj = new Prison(card.name, 
                            card.actionType, 
                            card.description, 
                            card.pos)
          break;
        
        case "companies":
            cardObj = new Companies(card.name, 
                                card.cost, 
                                card.multiplier, // [4, 10], [25, 50, 100, 200] 
                                card.mortgage,
                                card.bought,
                                card.pos,
                                card.owner)
            break;
        
        default:
          break;
      }
      if(cardObj != null) this.cards.push(cardObj)
    })
  }
  
  getPlayer() {
    return this.players[this.playerIndex];
  }
  getPlayerName() {
    return this.getPlayer()?.name;
  }

  getCard(position : number) {
    let Card = this.cards[32];
    this.cards.forEach(card =>{
      if (position == card.position) {
        Card = card;
      }
    })
    return Card;
  }

  getCards() {
    return this.cards;
  }

  allCardsOwned(cardColor? : string) {
    let count = 0;
    let specialCount = 0;
    let railRoadCount = 0;
    let taxeCount = 0;
    this.cards.forEach(card =>{
      if (card instanceof Cities && card.owner != null && !card.mortage) {
        if (cardColor == card.color) {
          count++;
        }
        if (cardColor == "blue") {
          specialCount++;
        }
        if (cardColor == "brown") {
          specialCount++;
        }
      }
      if (card instanceof Companies && card.owner != null && !card.mortage) {
        if (card.multiplier.length == 3) {
          taxeCount++;
        }
        if (card.multiplier.length == 5) {
          railRoadCount++;
        }
      }
    })

    return (specialCount == 2 || count == 3 || railRoadCount == 4 || taxeCount == 2);
  }

  moneyDistibution() {
    

  }

  turnActionsCard(card: Actions, player: PlayerType){
     switch (card.actionType) {
        case 'goto':
        //   let breakInBad = card as Prison;
        //   breakInBad.players.push(player)
        //   this.updatePlayer([player])
        //   this.updateCards([breakInBad])
          break;
        case 'freePark':
          // player.bankAmount += this.center;
          // this.updatePlayer([player])
          break;
        case 'inJail':
          break;
        case 'start':
          // player.bankAmount += this.startAmount
          // this.updatePlayer([player])
          break;
       default:
         break;
     }
  }

  turn() {
    if(!this.lock) throw new Error("Not  yet");
    
    /* if(this.ws) 
    {
      this.cards = transform(ws.get()).players 
      this.players = transform(ws.get()).cards
    }*/

    let playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
    let turnData! : (PlayerType | CardType | number[])[];
    this.owner = this.players[this.playerIndex];
    let colorSet = this.getCard(this.players[this.playerIndex].position) as Cities

    if (!this.players[this.playerIndex].inJail) turnData = playerActions.turn(this.ndBices, this.allCardsOwned(colorSet.color));

    let prisonLaunch = playerActions.launchdice(this.ndBices)[0];

    this.lock = false;

    this.turnData = turnData;
    this.prisonLaunch = prisonLaunch;

    return [turnData, prisonLaunch];
  }
  
  checkAction(action : string){
    
    let playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
    let colorSet = this.getCard(this.players[this.playerIndex].position) as Cities
    
    switch (action) {
      case "end turn":
        this.lock = true;
        this.owner = undefined;
        if (this.players[this.playerIndex].inJail) this.lock = playerActions.checkJail(this.players, this.ndBices, this.playerIndex, this.lock, action, this.prisonLaunch);
        if (!this.players[this.playerIndex].inJail) this.playerIndex = playerActions.checkMove(this.players, this.turnData[0] as number[], this.playerIndex, this.lock, this.owner);
        break;
    }
    
    switch (action) {
      case "pay jail fee":
        playerActions.jailFee(50, "jailFee")
        this.lock = true;
        break;
      case "use card":
        playerActions.jailFee(50, "use card")
        this.lock = true;
      break;
    }

    if (this.getCard(this.players[this.playerIndex].position) instanceof Cities && this.owner != undefined && this.allCardsOwned(colorSet.color)) {
      switch (action) {
        case "upgrade":
          playerActions.upgrade(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner = undefined;
          break;
      }
    }

    if ((this.getCard(this.players[this.playerIndex].position) instanceof Cities || this.getCard(this.players[this.playerIndex].position) instanceof Companies) && this.owner != undefined) {
      switch (action) {
        case "buy":
          playerActions.buy(this.getCard(this.players[this.playerIndex].position) as Passive)
          this.owner = undefined;
          break;

        case "sell property":
          playerActions.sellProperty(this.getCard(this.players[this.playerIndex].position) as Passive)
          this.owner = undefined;
          break;

        case "mortage":
          playerActions.mortage(this.getCard(this.players[this.playerIndex].position) as Passive, this.allCardsOwned(colorSet.color));
          this.owner = undefined;
          break;

        case "unmortage":
          playerActions.unMortage(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner = undefined;
          break;

        case "sell building":
          playerActions.sellBuilding(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner = undefined;
          break;

        case "sell all buildings":
          playerActions.sellAllBuildings(colorSet.color);
          this.owner = undefined;
          break;

        case "auction":
          // playerActions.auction(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner = undefined;
          break;
        
        case "loan money":
          this.owner = undefined;
          break;
      }
    }
  }
}

class Json {
  constructor(json :string ){

    Object.assign(this, JSON.parse(json))
  }
}

export function transform(json : string, game: Game) {
  let jsonClass = new Json(json)
  Object.setPrototypeOf(jsonClass, game)
  return game
}