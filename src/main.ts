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

/* class Game {
  nbPlayers: number;
  ias?: IA[];
  cards!: CardType[];

  // constructor(nbPlayers: number, ias: IA[], cards: JSON) {
  //   this.nbPlayers = nbPlayers;
  //   this.ias = ias;
  //   this.init(cards);
  // }

  constructor(nbPlayers: number, ias: IA[]) {
    this.nbPlayers = nbPlayers;
    this.ias = ias;
  }

  init(cards_json: JSON): void {
    print();
  }
  

  updateCards(cardsUpdate?: CardType[]): void {
    this.cards.map((card) => {
      const card2 = cardsUpdate?.find((i2) => (i2.name = card.name));
      return card2 ? card2 : card;
    });
  }

  test() {
    return "test";
  }
}

export default {
  Game,
};*/

let player: PlayerType = {
  name: "",
  dataBaseId: 0,
  bankAmount: 1500,
  display: {
    backImage: "",
    color: "",
    frontImage: "",
    position: 0
  }
};

let actionCard5 : Actions = new Actions("", "", "", {
  backImage: "",
  color: "",
  frontImage: "",
  position: 5
});
let actionCard10 : Actions = new Actions("", "", "", {
  backImage: "",
  color: "",
  frontImage: "",
  position: 10
});

let actionCard15 : Actions = new Actions("", "", "", {
  backImage: "",
  color: "",
  frontImage: "",
  position: 15
});

let cards : Array<CardType>= [];

cards.push(actionCard5)
cards.push(actionCard10)
cards.push(actionCard15)

for (let index = 0; index < 20; index++) {
  if (index%5 != 0) {
    let cardPassive : Passive = new Companies("", 100, [1, 4, 10], 10, {
      backImage: "",
      color: "",
      frontImage: "",
      position: index
    })

    cards.push(cardPassive);
    
  }
  
}

let playerTurn = new PlayerTurn(player, cards)
let turn = 3;

for(let info of playerTurn.turn(2)){
  if(info as PlayerType) {
    info = info as PlayerType;
    player = info;
    console.log(player)
  } else if (info as [number[], number])
  {
    info = info as [number[], number]
    if(info[0][1] == info[0][0])
      turn--;
    console.log(info[0], info)
  } else if (info as CardType) 
  {
    info = info as CardType;
    switch (info) {
      case info as Prison:
        break;
      case info as Actions:
        break;
      
      case info as Cities:
        break
      case info as Companies:
        break;
      default:
        throw new Error("Not a valid card");
    }
  }

  if(turn == 0) 
    player.display.position = 10
}
