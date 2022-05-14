"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = require("./Cards/Actions");
const Companies_1 = require("./Cards/Companies");
const PlayerTurn_1 = __importDefault(require("./Player/PlayerTurn"));
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
let player = {
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
let actionCard5 = new Actions_1.Actions("", "", "", {
    backImage: "",
    color: "",
    frontImage: "",
    position: 5
});
let actionCard10 = new Actions_1.Actions("", "", "", {
    backImage: "",
    color: "",
    frontImage: "",
    position: 10
});
let actionCard15 = new Actions_1.Actions("", "", "", {
    backImage: "",
    color: "",
    frontImage: "",
    position: 15
});
let cards = [];
cards.push(actionCard5);
cards.push(actionCard10);
cards.push(actionCard15);
for (let index = 0; index < 20; index++) {
    if (index % 5 != 0) {
        let cardPassive = new Companies_1.Companies("", 100, [1, 4, 10], 10, {
            backImage: "",
            color: "",
            frontImage: "",
            position: index
        });
        cards.push(cardPassive);
    }
}
let playerTurn = new PlayerTurn_1.default(player, cards);
for (let info of playerTurn.turn(2)) {
    console.log(info);
}
//# sourceMappingURL=main.js.map