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
        this.intiPlayers((players ? JSON.parse(players) : players), bankAmount);
        this.initCards(cards);
        this.ndBices = ndbices;
        this.startAmount = startAmount;
        this.jailTime = jailTime;
        this.jail = cards.filter(card => card)[0];
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
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.rent, card.mortagePrice, card.buildCost, card.pos);
                    break;
                case "prison":
                    cardObj = new Prison_1.Prison(card.name, card.actionType, card.description, card.pos);
                    break;
                case "companies":
                    cardObj = new Companies_1.Companies(card.name, card.cost, card.multiplier, // [4, 10], [25, 50, 100, 200] 
                    card.mortgage, card.pos);
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
    turnPlayer(player, cardsUpdate, playersUpdate) {
        this.updateCards(cardsUpdate);
        this.updatePlayer(playersUpdate);
        let playerActions = new PlayerAction_1.default(player, this.cards, this.jailTime, this.startAmount);
        return playerActions.turn(this.ndBices, this.jail);
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
    turnActionsCard(card, player) {
        switch (card.actionType) {
            case 'goto':
                player.position = 10;
                let card = this.cards.filter((card) => card)[0];
                let breakInBad = card;
                breakInBad.players.push(player);
                this.updatePlayer([player]);
                this.updateCards([breakInBad]);
                break;
            case 'freePark':
                player.bankAmount += this.center;
                this.updatePlayer([player]);
                break;
            case 'jail':
                break;
            case 'start':
                player.bankAmount += this.startAmount;
                this.updatePlayer([player]);
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
        let actions = [];
        let turnData = this.turnPlayer(this.players[this.playerIndex]);
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.jailTime, this.startAmount);
        if (turnData[2] instanceof Actions_1.Actions) {
            actions = [];
        }
        else {
            actions = ["buy", "sell", "build"];
        }
        if (turnData[2] instanceof Cities_1.Cities) {
            playerActions.buy(this.players[this.playerIndex], turnData[2].cost);
        }
        let dices = turnData[0];
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
// export { Game, transform };
// let game = new Game([])
// JSON.stringify(game)
//# sourceMappingURL=main.js.map