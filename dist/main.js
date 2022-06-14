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
                jailTime: 1,
                bankRupted: false,
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
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.rent, card.color, card.buildCost, card.mortage, card.pos, card.owner);
                    break;
                case "prison":
                    cardObj = new Prison_1.Prison(card.name, card.actionType, card.description, card.pos);
                    break;
                case "companies":
                    cardObj = new Companies_1.Companies(card.name, card.cost, card.multiplier, // [4, 10], [25, 50, 100, 200] 
                    card.mortgage, card.bought, card.pos, card.owner);
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
    allCardsOwned(cardColor) {
        let count = 0;
        let specialCount = 0;
        let railRoadCount = 0;
        let taxeCount = 0;
        this.cards.forEach(card => {
            if (card instanceof Cities_1.Cities && card.owner != null && !card.mortage) {
                if (cardColor == card.color) {
                    count++;
                }
                if (cardColor == "blue") {
                    specialCount++;
                }
                if (cardColor == "brown") {
                    specialCount++;
                }
            }
            if (card instanceof Companies_1.Companies && card.owner != null && !card.mortage) {
                if (card.multiplier.length == 3) {
                    taxeCount++;
                }
                if (card.multiplier.length == 5) {
                    railRoadCount++;
                }
            }
        });
        return (specialCount == 2 || count == 3 || railRoadCount == 4 || taxeCount == 2);
    }
    end() {
        let count = 0;
        this.players.forEach(player => {
            if (player.bankRupted)
                count++;
        });
        return (count == this.players.length - 1);
    }
    moneyDistribution() {
    }
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
        /* if(this.ws)
        {
          this.cards = transform(ws.get()).players
          this.players = transform(ws.get()).cards
        }*/
        if (this.lock && !this.players[this.playerIndex].bankRupted || this.canEnd && !this.players[this.playerIndex].bankRupted) {
            this.lock = false;
            let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
            let colorSet = this.getCard(this.players[this.playerIndex].position);
            let prisonLaunch;
            let result;
            if (!this.players[this.playerIndex].inJail) {
                this.turnData = playerActions.turn(this.ndBices, this.allCardsOwned(colorSet.color));
                this.canEnd = playerActions.checkMove(this.turnData[0]);
            }
            if (this.players[this.playerIndex].inJail) {
                console.log(prisonLaunch);
                prisonLaunch = playerActions.launchdice(this.ndBices)[0];
                console.log(prisonLaunch);
                result = playerActions.checkJail(this.players, this.playerIndex, this.lock, prisonLaunch);
            }
            this.owner = this.players[this.playerIndex];
            this.canTurn = true;
            this.prisonLaunch = prisonLaunch;
        }
        if (this.end()) {
            console.log("lol");
        }
    }
    checkAction(action) {
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
        let colorSet = this.getCard(this.players[this.playerIndex].position);
        switch (action) {
            case "end turn":
                this.lock = true;
                this.owner = undefined;
                if (this.players[this.playerIndex].bankRupted)
                    this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                if (!this.players[this.playerIndex].inJail && this.canTurn && !this.canEnd)
                    this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                this.canTurn = false;
                break;
        }
        let paid;
        switch (action) {
            case "pay jail fee":
                paid = playerActions.jailFee(50, "jailFee");
                this.playerIndex = playerActions.checkJail(this.players, this.playerIndex, this.lock, this.prisonLaunch, paid)[1];
                this.lock = true;
                break;
            case "use card":
                paid = playerActions.jailFee(50, "use card");
                this.playerIndex = playerActions.checkJail(this.players, this.playerIndex, this.lock, this.prisonLaunch, paid)[1];
                this.lock = true;
                break;
        }
        if (this.getCard(this.players[this.playerIndex].position) instanceof Cities_1.Cities && this.owner != undefined && this.allCardsOwned(colorSet.color)) {
            switch (action) {
                case "upgrade":
                    playerActions.upgrade(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
            }
        }
        if ((this.getCard(this.players[this.playerIndex].position) instanceof Cities_1.Cities || this.getCard(this.players[this.playerIndex].position) instanceof Companies_1.Companies) && this.owner != undefined) {
            switch (action) {
                case "buy":
                    playerActions.buy(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "sell property":
                    playerActions.sellProperty(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "mortage":
                    playerActions.mortage(this.getCard(this.players[this.playerIndex].position), this.allCardsOwned(colorSet.color));
                    this.owner = undefined;
                    break;
                case "unmortage":
                    playerActions.unMortage(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "sell building":
                    playerActions.sellBuilding(this.getCard(this.players[this.playerIndex].position));
                    this.owner = undefined;
                    break;
                case "sell all buildings":
                    playerActions.sellAllBuildings(colorSet.color);
                    this.owner = undefined;
                    break;
                case "auction":
                    // playerActions.auction(this.getCard(this.players[this.playerIndex].position) as Passive);
                    this.owner = undefined;
                    break;
                case "loan money":
                    this.owner = undefined;
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