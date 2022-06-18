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
                loan: 2000,
                position: 0,
                inJail: false,
                jailTime: 3,
                bankRupted: false,
                bid: 0,
                distribution: this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], bankAmount),
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
                    cardObj = new Actions_1.Actions(card.name, card.actionType, card.action, card.description, card.pos);
                    break;
                case "cities":
                    cardObj = new Cities_1.Cities(card.name, card.cost, card.rent, card.color, card.buildCost, card.mortage, card.pos, card.owner);
                    break;
                case "prison":
                    cardObj = new Prison_1.Prison(card.name, card.description, card.position, card.owner);
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
    moneyDistribution(S, X) {
        let max = S.length - 1;
        let L;
        L = [5, 5, 5, 6, 2, 2, 2];
        if (X >= 1500)
            X -= 1500;
        else {
            for (let i = 0; i < L.length; i++) {
                let countMemory = L[i];
                while (X - S[i] >= 0 && countMemory > 0) {
                    X -= S[i];
                    countMemory--;
                }
                L[i] -= countMemory;
            }
        }
        for (max; max > -1; max--) {
            let count = L[max];
            while (X - S[max] >= 0) {
                console.log("li ", X);
                console.log("hum ", S[max]);
                X -= S[max];
                count++;
            }
            L[max] = count;
        }
        return L;
    }
    auction(card, bids) {
        bids === null || bids === void 0 ? void 0 : bids.push(this.players[this.playerIndex].bid);
        if (bids && bids.length == this.players.length) {
            let finalBid = 0;
            bids.forEach(bid => {
                if (bid > finalBid) {
                    finalBid = bid;
                }
            });
            this.players.forEach(player => {
                if (player.bid == finalBid && player.bid - finalBid > 0) {
                    card.owner = player;
                    player.bid = 0;
                }
            });
        }
    }
    turnActionsCard(card) {
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
        switch (card.actionType) {
            case "luck":
                let randomLuck = Math.floor(Math.random() * 16);
                console.log(card.action[randomLuck]);
                switch (card.action[randomLuck].type) {
                    case "goto":
                        if (this.players[this.playerIndex].position > card.action[randomLuck].position)
                            this.players[this.playerIndex].bankAmount += this.startAmount;
                        this.players[this.playerIndex].position = card.action[randomLuck].position;
                        break;
                    case "pay":
                        this.players[this.playerIndex].bankAmount += card.action[randomLuck].amount;
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        playerActions.endGame(this.players);
                        break;
                    case "freeJail":
                        let prison = this.getCard(10);
                        prison.owners.push(this.players[this.playerIndex]);
                        break;
                    case "repair":
                        this.cards.forEach(card => {
                            if (card instanceof Cities_1.Cities && card.owner == this.players[this.playerIndex]) {
                                if (card.propreties == 5)
                                    this.players[this.playerIndex].bankAmount -= 100;
                                else {
                                    this.players[this.playerIndex].bankAmount -= 25 * card.propreties;
                                }
                            }
                        });
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        playerActions.endGame(this.players);
                        break;
                    case "inJail":
                        this.players[this.playerIndex].inJail = true;
                        this.players[this.playerIndex].jailTime = 0;
                        this.players[this.playerIndex].position = 10;
                        break;
                    case "goBack":
                        this.players[this.playerIndex].position -= 3;
                        if (this.players[this.playerIndex].position - 3 < 0)
                            this.players[this.playerIndex].position = 40 + (this.players[this.playerIndex].position - 3);
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        break;
                    case "gotoUtility":
                        if (this.players[this.playerIndex].position > 21)
                            this.players[this.playerIndex].position = 38;
                        else
                            this.players[this.playerIndex].position = 4;
                        let dices = this.turnData[0];
                        let sumDices = dices[0] + dices[1];
                        playerActions.rent(this.getCard(this.players[this.playerIndex].position), 2, sumDices, true, this.players);
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        playerActions.endGame(this.players);
                        break;
                    case "gotoRail":
                        let count = 0;
                        let railCard = this.getCard(this.players[this.playerIndex].position);
                        while (this.players[this.playerIndex].position - 10 > 0) {
                            count++;
                            this.players[this.playerIndex].position -= 10;
                        }
                        this.players[this.playerIndex].position = 5 + 10 * count;
                        playerActions.rent(this.getCard(this.players[this.playerIndex].position), railCard.propreties, this.ndBices, true, this.players);
                        playerActions.rent(this.getCard(this.players[this.playerIndex].position), railCard.propreties, this.ndBices, true, this.players);
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        console.log(card.action[randomLuck].description);
                        break;
                    case "chairman":
                        this.players.forEach(player => {
                            if (player != this.players[this.playerIndex]) {
                                this.players[this.playerIndex].bankAmount -= 50;
                                player.bankAmount += 50;
                            }
                            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], player.bankAmount);
                        });
                        playerActions.endGame(this.players);
                        break;
                }
                break;
            case "community":
                let randomCommunity = Math.floor(Math.random() * 16);
                console.log(card.action[randomCommunity]);
                switch (card.action[randomCommunity].type) {
                    case "goto":
                        this.players[this.playerIndex].position = card.action[randomCommunity].position;
                        break;
                    case "pay":
                        this.players[this.playerIndex].bankAmount += card.action[randomCommunity].amount;
                        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                        playerActions.endGame(this.players);
                        break;
                    case "freeJail":
                        let prison = this.getCard(10);
                        prison.owners.push(this.players[this.playerIndex]);
                        break;
                    case "repair":
                        this.cards.forEach(card => {
                            if (card instanceof Cities_1.Cities) {
                                if (card.propreties == 5)
                                    this.players[this.playerIndex].bankAmount -= 115;
                                else {
                                    this.players[this.playerIndex].bankAmount -= 40 * card.propreties;
                                }
                            }
                        });
                        playerActions.endGame(this.players);
                        break;
                    case "inJail":
                        this.players[this.playerIndex].inJail = true;
                        this.players[this.playerIndex].jailTime = 1;
                        this.players[this.playerIndex].position = 10;
                        break;
                    case "birthday":
                        this.players.forEach(player => {
                            if (player != this.players[this.playerIndex]) {
                                player.bankAmount -= 10;
                                this.players[this.playerIndex].bankAmount += 10;
                            }
                        });
                        playerActions.endGame(this.players);
                        break;
                }
                break;
            case "inJail":
                this.players[this.playerIndex].inJail = true;
                this.players[this.playerIndex].jailTime = 1;
                this.players[this.playerIndex].position = 10;
                break;
            case "start":
                this.players[this.playerIndex].bankAmount += this.startAmount;
                break;
            case "taxe":
                this.players[this.playerIndex].bankAmount -= 200;
            default:
                break;
        }
    }
    turn() {
        if (this.lock && !this.players[this.playerIndex].bankRupted || this.canEnd && !this.players[this.playerIndex].bankRupted) {
            this.lock = false;
            let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
            let card = this.getCard(this.players[this.playerIndex].position);
            let prisonLaunch;
            this.canTurn = true;
            if (!this.players[this.playerIndex].inJail) {
                this.turnData = playerActions.turn(this.ndBices, this.allCardsOwned(card.color), this.players);
                this.canEnd = playerActions.checkMove(this.turnData[0]);
                this.players[this.playerIndex] = playerActions.jailed();
            }
            this.owner = this.players[this.playerIndex];
            if (this.players[this.playerIndex].inJail) {
                if (!this.players[this.playerIndex].jailTime) {
                    this.canTurn = false;
                    this.owner = undefined;
                    this.players[this.playerIndex].jailTime++;
                    this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                }
                else {
                    prisonLaunch = playerActions.launchdice(this.ndBices)[0];
                    if (playerActions.checkJail(prisonLaunch))
                        this.lock = false;
                    else if (this.players[this.playerIndex].jailTime - 1 < 3) {
                        this.lock = true;
                        this.canTurn = false;
                        this.owner = undefined;
                        if (this.players[this.playerIndex].jailTime <= 3)
                            this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                    }
                }
            }
            if (this.getCard(this.players[this.playerIndex].position) instanceof Actions_1.Actions)
                this.turnActionsCard(this.getCard(this.players[this.playerIndex].position));
            this.prisonLaunch = prisonLaunch;
            if (this.owner)
                this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            return this.turnData;
        }
        if (this.end()) {
            console.log("lol");
        }
    }
    checkAction(action, bids, player, amount) {
        let playerActions = new PlayerAction_1.default(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
        let card = this.getCard(this.players[this.playerIndex].position);
        let auctionCard = this.getCard(this.players[this.playerIndex].position);
        let paid;
        switch (action) {
            case "pay jail fee":
                paid = playerActions.jailFee(50, "jailFee");
                if (playerActions.checkJail(this.prisonLaunch, paid))
                    this.lock = false;
                break;
            case "use card":
                paid = playerActions.jailFee(50, "use card", this.getCard(10));
                if (playerActions.checkJail(this.prisonLaunch, paid))
                    this.lock = false;
                this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                break;
            case "end turn":
                this.lock = true;
                this.owner = undefined;
                if (this.players[this.playerIndex].bankRupted)
                    this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                if (!this.players[this.playerIndex].inJail && this.canTurn && !this.canEnd) {
                    if (auctionCard.owner == null)
                        this.auction(auctionCard, bids);
                    this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
                }
                this.canTurn = false;
                break;
        }
        if (this.getCard(this.players[this.playerIndex].position) instanceof Cities_1.Cities && this.owner != undefined && this.allCardsOwned(card.color)) {
            switch (action) {
                case "upgrade":
                    playerActions.upgrade(this.getCard(this.players[this.playerIndex].position));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
            }
        }
        if ((this.getCard(this.players[this.playerIndex].position) instanceof Cities_1.Cities || this.getCard(this.players[this.playerIndex].position) instanceof Companies_1.Companies) && this.owner != undefined) {
            switch (action) {
                case "buy":
                    playerActions.buy(this.getCard(this.players[this.playerIndex].position));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "sell property":
                    playerActions.sellProperty(this.getCard(this.players[this.playerIndex].position));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "mortage":
                    playerActions.mortage(this.getCard(this.players[this.playerIndex].position), this.allCardsOwned(card.color));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "unmortage":
                    playerActions.unMortage(this.getCard(this.players[this.playerIndex].position));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "sell building":
                    playerActions.sellBuilding(this.getCard(this.players[this.playerIndex].position));
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "sell all buildings":
                    playerActions.sellAllBuildings(card.color);
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "trade":
                    playerActions.trade(this.getCard(this.players[this.playerIndex].position), player);
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "loan money":
                    playerActions.loan(amount);
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
                    this.owner = undefined;
                    break;
                case "pay loan":
                    playerActions.payLoan();
                    this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
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