"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.Game = void 0;
const Cards_1 = __importDefault(require("./Cards"));
const Actions_1 = require("./Cards/Actions");
const Cities_1 = require("./Cards/Cities");
const Companies_1 = require("./Cards/Companies");
const Prison_1 = require("./Cards/Prison");
const PlayerAction_1 = __importDefault(require("./Player/PlayerAction"));
class Game {
    constructor(players, cards = Cards_1.default.Cards_json, bankAmount = 1500, ndbices = 2, startAmount = 200, inJail = false, ...partyParam) {
        this.players = [];
        this.cards = [];
        this.playerIndex = 0;
        this.center = 0;
        this.lock = true;
        this.intiPlayers((players ? JSON.parse(players) : players), bankAmount);
        this.initCards(cards);
        this.ndBices = ndbices;
        this.startAmount = startAmount;
        this.inJail = inJail;
    }
    intiPlayers(players, bankAmount) {
        players.forEach((player) => {
            let playerObj = {
                name: (player ? JSON.parse(player) : player).name,
                bankAmount: bankAmount,
                position: 0,
                inJail: false,
                jailTime: 3,
                ia: player.ia
            };
            this.players.push(playerObj);
        });
    }
    initCards(cards) {
        cards.forEach(card => {
            let cardObj = null;
            switch (card.type) {
                case "action":
                    cardObj = new Actions_1.Actions(card.name, card.actionType, card.description, card.pos);
                    break;
                case "cities":
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.rent, card.buildCost, card.mortage, card.pos, card.owner);
                    break;
                case "prison":
                    cardObj = new Prison_1.Prison(card.name, card.actionType, card.description, card.pos);
                    break;
                case "companies":
                    cardObj = new Companies_1.Companies(card.name, card.cost, card.multiplier, // [4, 10], [25, 50, 100, 200] 
                    card.mortgage, card.pos, card.owner);
                    break;
                default:
                    break;
            }
            if (cardObj != null)
                this.cards.push(cardObj);
        });
    }
    getPlayer() {
        return this.players[this.playerIndex];
    }
    getPlayerName() {
        var _a;
        return (_a = this.getPlayer()) === null || _a === void 0 ? void 0 : _a.name;
    }
    getCard(position) {
        let Card = this.cards[32];
        this.cards.forEach(card => {
            if (position == card.position) {
                Card = card;
            }
        });
        return Card;
    }
    getCards() {
        return this.cards;
    }
    allCardsOwned() {
        this.cards.forEach(card => {
            if ((card instanceof Cities_1.Cities || card instanceof Companies_1.Companies) && card.owner == null) {
                return false;
            }
        });
        return true;
    }
    // updateCards(cardsUpdate?: CardType[]): void {
    //   this.cards.map((card) => {
    //     const card2 = cardsUpdate?.find((i2) => (i2.name = card.name));
    //     return card2 ? card2 : card;
    //   });
    // }
    // updatePlayer(playersUpdate?: PlayerType[]) : void {
    //   this.players?.map((player) => {
    //     const player2 = playersUpdate?.find((i2) => (i2.name = player.name));
    //     return player2 ? player2 : player;
    //   });
    // }
    turnActionsCard(card, player) {
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
        if (!this.lock)
            throw new Error("Not  yet");
        /* if(this.ws)
        {
          this.cards = transform(ws.get()).players
          this.players = transform(ws.get()).cards
        }*/
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
        let turnData = playerActions.turn(this.ndBices);
        this.owner = this.players[this.playerIndex];
        this.lock = false;
        return this.turnData = turnData;
    }
    checkAction(action) {
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
        switch (action) {
            case "end turn":
                this.lock = true;
                this.playerIndex = playerActions.checkMove(this.players, this.turnData[0], this.playerIndex, this.lock);
                break;
        }
        switch (action) {
            case "pay jail fee":
                playerActions.jailFee(50, "jailFee");
                break;
            case "use card":
                playerActions.jailFee(50, "use card");
                break;
        }
        if ((this.getCard(this.players[this.playerIndex].position) instanceof Cities_1.Cities || this.getCard(this.players[this.playerIndex].position) instanceof Companies_1.Companies) && this.owner != undefined) {
            switch (action) {
                case "buy":
                    playerActions.buy(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "sell":
                    playerActions.sell(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "upgrade":
                    playerActions.upgrade(this.getCard(this.players[this.playerIndex].position), this.allCardsOwned());
                    this.owner = undefined;
                    break;
                case "mortage":
                    break;
                case "auction":
                    break;
            }
        }
    }
}
exports.Game = Game;
class Json {
    constructor(json) {
        Object.assign(this, JSON.parse(json));
    }
}
function transform(json, game) {
    let jsonClass = new Json(json);
    Object.setPrototypeOf(jsonClass, game);
    return game;
}
exports.transform = transform;
//# sourceMappingURL=main.js.map