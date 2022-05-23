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
  jail : Prison;

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
    this.jail = cards.filter(card => card as Prison)[0] as Prison
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
                            card.pos)
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
                                card.pos)
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

  turnPlayer(player : PlayerType, cardsUpdate?: CardType[], playersUpdate?: PlayerType[]){
    
    this.updateCards(cardsUpdate)
    this.updatePlayer(playersUpdate)

    let playerActions = new PlayerActions(player, this.cards, this.jailTime, this.startAmount);
    
    /**
     * turn contains
     * dicies
     * player
     * card where player is
     */

    
    return playerActions.turn(this.ndBices, this.jail)
      
    // let turn = 3; // 3 double go prison

    /* for(let info of playerActions.turn(this.ndBices)){ 
      if(info as PlayerType) {
        info = info as PlayerType;
        player = info;
        yield player
      } else if (info as [number[], number])
      {
        info = info as [number[], number]
        if(info[0][1] == info[0][0])
          turn--;
        yield info[0]
      } else if (info as CardType) 
      {
        yield info as CardType
      }

    if(turn == 0) 
      player.display.position = 10
    }*/
  }

  turnActionsCard(card: Actions, player: PlayerType){
     switch (card.actionType) {
        case 'goto':
          player.position = 10
          let card : CardType = this.cards.filter((card) => card as Prison)[0]
          let breakInBad = card as Prison;
          breakInBad.players.push(player)
          this.updatePlayer([player])
          this.updateCards([breakInBad])
          break;
        case 'freePark':
          player.bankAmount += this.center;
          this.updatePlayer([player])
          break;
        case 'jail':
          break;
        case 'start':
          player.bankAmount += this.startAmount
          this.updatePlayer([player])
          break;
       default:
         break;
     }
  }

  turn() {
    // if(!this.lock) throw new Error("Not  yet");
    /* if(this.ws) 
    {
      this.cards = transform(ws.get()).players 
      this.players = transform(ws.get()).cards
    }*/
    let actions = []
    let turnData = this.turnPlayer(this.players[this.playerIndex]);
    let playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);
    
    if (turnData[2] instanceof Actions) {
      actions = [];
    } else {
      actions = ["buy", "sell", "build"];
    }

    if(turnData[2] instanceof Cities) {
      playerActions.buy(this.players[this.playerIndex], turnData[2].cost)
    }
    
    let dices = turnData[0] as number[];

    if (dices[1] != dices[0]) {
      this.playerIndex += 1;
      if (this.players.length - 1 < this.playerIndex)
        this.playerIndex = 0;
    } 
    // else {
    //   this.jail.players.push(this.players[this.playerIndex])
    // }

    // this.lock = true
    return turnData;
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

// export { Game, transform };


// let game = new Game([])

// JSON.stringify(game)

