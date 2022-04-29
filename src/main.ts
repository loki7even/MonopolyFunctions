import { CardType } from "./Cards/CardsType";

interface IA {
  name: string;
  difficulty: number;
}

class Game {
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
};
