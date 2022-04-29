"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    // constructor(nbPlayers: number, ias: IA[], cards: JSON) {
    //   this.nbPlayers = nbPlayers;
    //   this.ias = ias;
    //   this.init(cards);
    // }
    constructor(nbPlayers, ias) {
        this.nbPlayers = nbPlayers;
        this.ias = ias;
    }
    init(cards_json) {
        print();
    }
    updateCards(cardsUpdate) {
        this.cards.map((card) => {
            const card2 = cardsUpdate === null || cardsUpdate === void 0 ? void 0 : cardsUpdate.find((i2) => (i2.name = card.name));
            return card2 ? card2 : card;
        });
    }
    test() {
        return "test";
    }
}
exports.default = {
    Game,
};
//# sourceMappingURL=main.js.map