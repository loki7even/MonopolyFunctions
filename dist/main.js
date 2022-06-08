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
    constructor(players, cards = Cards_1.default.Cards_json, bankAmount = 1500, ndbices = 2, startAmount = 200, jailTime = 3, ...partyParam) {
        this.players = [];
        this.cards = [];
        this.playerIndex = 0;
        this.center = 0;
        this.lock = true;
        this.intiPlayers((players ? JSON.parse(players) : players), bankAmount);
        this.initCards(cards);
        this.ndBices = ndbices;
        this.startAmount = startAmount;
        this.jailTime = jailTime;
    }
    intiPlayers(players, bankAmount) {
        players.forEach((player) => {
            let playerObj = {
                name: (player ? JSON.parse(player) : player).name,
                bankAmount: bankAmount,
                position: 0,
                jailtime: 3,
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
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.rent, card.mortagePrice, card.buildCost, card.pos, card.owner);
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
    turn(cardsUpdate, playersUpdate) {
        if (!this.lock)
            throw new Error("Not  yet");
        /* if(this.ws)
        {
          this.cards = transform(ws.get()).players
          this.players = transform(ws.get()).cards
        }*/
        this.updateCards(cardsUpdate);
        this.updatePlayer(playersUpdate);
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);
        let turnData = playerActions.turn(this.ndBices, this.lock);
        this.lock = false;
        this.playerIndex = playerActions.checkMove(this.players, turnData[0], this.jailTime, this.playerIndex, this.lock);
        return this.turnData = turnData;
    }
    checkAction(action) {
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);
        switch (action) {
            case "buy":
                playerActions.buy(this.players[this.playerIndex], this.getCard(this.players[this.playerIndex].position));
                this.lock = true;
                playerActions.changePlayer(this.players, this.players[this.playerIndex].position, this.lock);
                break;
            case "sell":
                playerActions.sell(this.players[this.playerIndex], this.getCard(this.players[this.playerIndex].position));
                this.lock = true;
                if (this.players[this.playerIndex])
                    playerActions.changePlayer(this.players, this.players[this.playerIndex].position, this.lock);
                break;
            case "bid":
                this.lock = true;
                break;
        }
        this.playerIndex = playerActions.checkMove(this.players, this.turnData[0], this.jailTime, this.playerIndex, this.lock);
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