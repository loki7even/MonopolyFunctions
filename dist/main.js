"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cards_1 = __importDefault(require("./Cards"));
const Actions_1 = require("./Cards/Actions");
const Cities_1 = require("./Cards/Cities");
const Companies_1 = require("./Cards/Companies");
const Prison_1 = require("./Cards/Prison");
const PlayerTurn_1 = __importDefault(require("./Player/PlayerTurn"));
class Game {
    constructor(cards, players, apiURL, ndbices = 2, ...partyParam) {
        this.cards = [];
        this.players = players;
        this.init(cards);
        this.ndBices = ndbices;
        this.apiURL = apiURL;
        if (this.apiURL == undefined)
            this.players = players;
        // else
        // ws.send()
    }
    init(cards) {
        cards.forEach(card => {
            let cardObj = null;
            switch (card.type) {
                case "action":
                    cardObj = new Actions_1.Actions(card.name, card.action, card.description, {
                        backImage: card.bg,
                        color: card.color,
                        frontImage: card.fg,
                        position: card.pos
                    });
                    break;
                case "cities":
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.hotelPrice, card.housePrice, card.mortagePrice, {
                        backImage: card.bg,
                        color: card.color,
                        frontImage: card.fg,
                        position: card.pos
                    });
                    break;
                case "prison":
                    cardObj = new Prison_1.Prison(card.name, card.action, card.description, {
                        backImage: card.bg,
                        color: card.color,
                        frontImage: card.fg,
                        position: card.pos
                    });
                    break;
                case "companies":
                    cardObj = new Companies_1.Companies(card.name, card.cost, card.multiplier, // [4, 10], [25, 50, 100, 200] 
                    card.initialCost, {
                        backImage: card.bg,
                        color: card.color,
                        frontImage: card.fg,
                        position: card.pos
                    });
                    break;
                default:
                    break;
            }
            if (cardObj != null)
                this.cards.push(cardObj);
        });
        console.log(this.cards.length);
    }
    updateCards(cardsUpdate) {
        this.cards.map((card) => {
            const card2 = cardsUpdate === null || cardsUpdate === void 0 ? void 0 : cardsUpdate.find((i2) => (i2.name = card.name));
            return card2 ? card2 : card;
        });
    }
    updatePlayer(playersUpdate) {
        var _a;
        (_a = this.players) === null || _a === void 0 ? void 0 : _a.map((player) => {
            const player2 = playersUpdate === null || playersUpdate === void 0 ? void 0 : playersUpdate.find((i2) => (i2.name = player.name));
            return player2 ? player2 : player;
        });
    }
    turn(player) {
        return new PlayerTurn_1.default(player, this.cards);
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
// export default {
// Game,
// };
let game = new Game(Cards_1.default.Cards_json, [], undefined, 2);
//# sourceMappingURL=main.js.map