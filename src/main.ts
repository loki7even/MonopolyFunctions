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
  jailTime: number;
  lock: boolean = false;

  constructor(players: Array<any> | string,
              cards: Array<any> = Cards.Cards_json,
              bankAmount=1500, 
              ndbices: number=2, 
              startAmount: number =200, 
              jailTime:number =3, ...partyParam: any) {
              
    this.intiPlayers((players as string ? JSON.parse(players as string): players ), bankAmount);
    this.initCards(cards);
    this.ndBices = ndbices
    this.startAmount = startAmount
    this.jailTime = jailTime
  }

  intiPlayers(players: Array<any>, bankAmount: number) {
    
    players.forEach((player) => {
      
      let playerObj : PlayerType = {
        name: (player as string ? JSON.parse(player): player ).name,
        bankAmount: bankAmount,
        position: 0,
        jailtime: 3,
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
                            card.mortagePrice, 
                            card.buildCost,
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

  updateCards(cardsUpdate?: CardType[]): void {
    this.cards.map((card) => {
      const card2 = cardsUpdate?.find((i2) => (i2.name = card.name));
      return card2 ? card2 : card;
    });
  }

  updatePlayer(playersUpdate?: PlayerType[]) : void {
    this.players?.map((player) => {
      const player2 = playersUpdate?.find((i2) => (i2.name = player.name));
      return player2 ? player2 : player;
    });
  }

  // turnActionsCard(card: Actions, player: PlayerType){
  //    switch (card.actionType) {
  //       case 'goto':
  //         let breakInBad = card as Prison;
  //         breakInBad.players.push(player)
  //         this.updatePlayer([player])
  //         this.updateCards([breakInBad])
  //         break;
  //       case 'freePark':
  //         player.bankAmount += this.center;
  //         this.updatePlayer([player])
  //         break;
  //       case 'jail':
  //         break;
  //       case 'start':
  //         player.bankAmount += this.startAmount
  //         this.updatePlayer([player])
  //         break;
  //      default:
  //        break;
  //    }
  // }

  turn(cardsUpdate?: CardType[], playersUpdate?: PlayerType[]) {
    // if(!this.lock) throw new Error("Not  yet");
    /* if(this.ws) 
    {
      this.cards = transform(ws.get()).players 
      this.players = transform(ws.get()).cards
    }*/
    
    this.updateCards(cardsUpdate)
    this.updatePlayer(playersUpdate)

    let playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);
    let turnData = playerActions.turn(this.ndBices);

    console.log(this.playerIndex);
    
    this.playerIndex = playerActions.checkMove(this.players, turnData[0] as number[], this.jailTime, this.playerIndex)
    
    return turnData;
  }

  checkAction(position : number, price : number, cardOwner : PlayerType, cardsUpdate?: CardType[], playersUpdate?: PlayerType[]) {

    let playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);

    console.log(this.getCard(position), cardOwner);

    if (this.getCard(position) instanceof Cities && cardOwner == undefined) {
      // this.lock = true
      playerActions.buy(this.players[this.playerIndex], price, this.getCard(position));
      console.log(cardOwner); // null ?????
      return cardOwner = this.players[this.playerIndex];
    }

    this.updateCards(cardsUpdate)
    this.updatePlayer(playersUpdate)
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