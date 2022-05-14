import { Actions } from "./Cards/Actions";
import { CardType, Passive } from "./Cards/CardsType";
import { Cities } from "./Cards/Cities";
import { Companies } from "./Cards/Companies";
import { Prison } from "./Cards/Prison";
import { PlayerType } from "./Player";
import PlayerTurn from "./Player/PlayerTurn";

interface IA {
  name: string;
  difficulty: number;
}

class Game {
  players?: PlayerType[];
  ias?: IA[];
  cards!: CardType[];
  ndBices: number;
  apiURL?: string;

  constructor(cards: string, players: PlayerType[], apiURL: string  | undefined, ndbices: number=2, ...partyParam: any) {
    this.players = players;
    this.init(cards);
    this.ndBices = ndbices
    this.apiURL= apiURL;
    if(this.apiURL == undefined)
      this.players = players
    // else
      // ws.send()
  }

  init(cards_json: string): void {
    let cards = JSON.parse(cards_json)
    for(let card of cards) {

      switch (card.type.lower()) {
        case "action":
          card = new Actions(card.name, 
                              card.action, 
                              card.description,
                              {
                                backImage: card.bg,
                                color: card.color,
                                frontImage: card.fg,
                                position: card.pos
                              })
          break;

        case "cities":
          card = new Cities(card.name, 
                            card.cost, 
                            card.hotelPrice, 
                            card.hotelPrice, 
                            card.hipoPrice, 
                            {
                              backImage: card.bg,
                              color: card.color,
                              frontImage: card.fg,
                              position: card.pos
                            })
          break;
        case "prison":
          card = new Prison(card.name, 
                            card.action, 
                            card.description, {
                              backImage: card.bg,
                              color: card.color,
                              frontImage: card.fg,
                              position: card.pos
                            })
          break;
        
        case "cp":
            card = new Companies(card.name, 
                                card.cost, 
                                card.multiplier, // [4, 10], [25, 50, 100, 200] 
                                card.initialCost,
                                {
                                  backImage: card.bg,
                                  color: card.color,
                                  frontImage: card.fg,
                                  position: card.pos
                                })
            break;     
        default:
          break;
      }

      this.cards.push(card)
    }
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

  turn(player : PlayerType){

    return new PlayerTurn(player, this.cards)
      
    // let turn = 3; // 3 double go prison

    /* for(let info of playerTurn.turn(this.ndBices)){ 
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
}

export default {
  Game,
};

// let player: PlayerType = {
//   name: "",
//   dataBaseId: 0,
//   bankAmount: 1500,
//   display: {
//     backImage: "",
//     color: "",
//     frontImage: "",
//     position: 0
//   }
// };

// let actionCard5 : Actions = new Actions("", "", "", {
//   backImage: "",
//   color: "",
//   frontImage: "",
//   position: 5
// });
// let actionCard10 : Actions = new Actions("", "", "", {
//   backImage: "",
//   color: "",
//   frontImage: "",
//   position: 10
// });

// let actionCard15 : Actions = new Actions("", "", "", {
//   backImage: "",
//   color: "",
//   frontImage: "",
//   position: 15
// });

// let cards : Array<CardType>= [];

// cards.push(actionCard5)
// cards.push(actionCard10)
// cards.push(actionCard15)

// for (let index = 0; index < 20; index++) {
//   if (index%5 != 0) {
//     let cardPassive : Passive = new Companies("", 100, [1, 4, 10], 10, {
//       backImage: "",
//       color: "",
//       frontImage: "",
//       position: index
//     })

//     cards.push(cardPassive);
    
//   }
  
// }