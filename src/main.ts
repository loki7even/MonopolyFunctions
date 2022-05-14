import Cards from "./Cards";
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
  cards: CardType[] = [];
  ndBices: number;

  constructor(players: PlayerType[],cards: Array<any> = Cards.Cards_json, ndbices: number=2, ...partyParam: any) {
    this.players = players;
    this.init(cards);
    this.ndBices = ndbices
  }

  init(cards: Array<any>): void {
    
    cards.forEach(card => {

      let cardObj: CardType | null = null;
      
      switch (card.type) {
        case "action":
          cardObj = new Actions(card.name, 
                              card.action, 
                              card.description,
                              {
                                backImage: card.bg,
                                color: card.color,
                                frontImage: card.fg,
                                position: card.pos
                              });
          
          break;

        case "cities":
          cardObj = new Cities(card.name, 
                            card.cost, 
                            card.hotelPrice, 
                            card.housePrice, 
                            card.mortagePrice, 
                            {
                              backImage: card.bg,
                              color: card.color,
                              frontImage: card.fg,
                              position: card.pos
                            })
          break;
        case "prison":
          cardObj = new Prison(card.name, 
                            card.action, 
                            card.description, {
                              backImage: card.bg,
                              color: card.color,
                              frontImage: card.fg,
                              position: card.pos
                            })
          break;
        
        case "companies":
            cardObj = new Companies(card.name, 
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
      if(cardObj != null) this.cards.push(cardObj)
    })
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
