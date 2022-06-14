"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const CardsType_1 = require("../Cards/CardsType");
const Cities_1 = require("../Cards/Cities");
const Companies_1 = require("../Cards/Companies");
const Actions_1 = require("../Cards/Actions");
class PlayerActions {
    constructor(player, cards, inJail, startAmount) {
        this.player = player;
        this.cards = cards;
        this.inJail = inJail;
        this.startAmount = startAmount;
    }
    turn(dices, allCardsOwned) {
        let launch = this.launchdice(dices);
        this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
        let cards = this.cards.filter((card) => {
            return card.position == this.player.position;
        });
        if (cards.length != 1)
            throw new Error("Too many cards");
        this.card = cards[0];
        if (this.card instanceof Actions_1.Actions)
            this.actionCard(this.card);
        if (this.card instanceof CardsType_1.Passive && this.card.owner != null)
            this.rent(this.card, this.card.propreties, dices, allCardsOwned);
        return [launch[0], this.player, this.card];
    }
    changePlayer(players, playerPos) {
        playerPos += 1;
        if (players.length - 1 < playerPos)
            playerPos = 0;
        return playerPos;
    }
    checkMove(dices) {
        if (dices[1] != dices[0]) {
            this.player.jailTime = 3;
        }
        else if (dices[1] == dices[0]) {
            this.player.jailTime--;
            return true;
        }
        if (this.player.jailTime == 0) {
            this.player.inJail = true;
            this.player.position = 10;
        }
        return false;
    }
    checkJail(players, playerPos, lock, launch, paid) {
        if (launch) {
            if (launch[0] == launch[1] && this.player.jailTime < 3) {
                this.player.inJail = false;
                this.player.jailTime = 3;
                this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
                lock = false;
                return [lock, playerPos];
            }
            if (this.player.jailTime < 3)
                this.player.jailTime++;
            if ((this.player.jailTime == 3 && paid) || (this.player.jailTime == 3 && this.player.inJail && paid)) {
                this.player.inJail = false;
                this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
                lock = false;
                return [lock, playerPos];
            }
        }
        if (!paid)
            playerPos = this.changePlayer(players, playerPos);
        return [lock, playerPos];
    }
    randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    launchdice(nbDice) {
        const dice = [];
        let sum = 0;
        while (nbDice > 0) {
            const rd = this.randomIntFromInterval(1, 6);
            dice.push(rd);
            sum += rd;
            nbDice--;
        }
        ;
        return [dice, sum];
    }
    movePlayer(move, lenBoard, startAmount) {
        this.player.position += move;
        if (this.player.position > lenBoard || this.player.position == 0) {
            this.player.position -= lenBoard;
            this.player.bankAmount += startAmount;
        }
        return this.player;
    }
    buy(card) {
        if (card.owner == null && !this.bankrupt(card.cost)) {
            if (card instanceof Companies_1.Companies && card.propreties < card.multiplier.length && !card.bought) {
                card.propreties += 1;
                card.bought = true;
            }
            card.owner = this.player;
            this.player.bankAmount -= card.cost;
        }
    }
    upgrade(card) {
        if (card.owner == this.player && !this.bankrupt(card.cost)) {
            if (card instanceof Cities_1.Cities && card.propreties < card.rent.length) {
                if (card.propreties == 4)
                    this.player.bankAmount -= 4 * card.buildCost;
                this.player.bankAmount -= card.buildCost;
            }
            card.propreties += 1;
        }
    }
    sellProperty(card) {
        if (card.owner == this.player && card.propreties == 0) {
            this.player.bankAmount += card.cost;
            card.owner = null;
        }
    }
    sellBuilding(card) {
        if (card.owner == this.player && card.propreties != 0) {
            if (card instanceof Cities_1.Cities) {
                if (card.propreties == 5)
                    this.player.bankAmount += 4 * (card.buildCost / 2);
                this.player.bankAmount += card.buildCost / 2;
            }
            card.propreties--;
        }
    }
    sellAllBuildings(cardColor) {
        this.cards.forEach(card => {
            if (card instanceof Cities_1.Cities && cardColor == card.color) {
                while (card.propreties != 0) {
                    this.sellBuilding(card);
                }
            }
        });
    }
    mortage(card, allCardsOwned) {
        if (card.owner != null && allCardsOwned && !card.mortage) {
            card.mortage = true;
            this.player.bankAmount += card.cost / 2;
        }
    }
    unMortage(card) {
        if (card.mortage && !this.bankrupt(((card.cost / 2) + ((card.cost / 2) * 0.1)))) {
            card.mortage = false;
            this.player.bankAmount -= ((card.cost / 2) + ((card.cost / 2) * 0.1));
        }
    }
    rent(card, amount, dices, allCardsOwned) {
        if (card.owner != null && card.owner != this.player && !card.mortage) {
            if (card instanceof Cities_1.Cities) {
                if (amount == 0) {
                    this.player.bankAmount -= (allCardsOwned ? 2 * card.rent[amount] : card.rent[amount]);
                    card.owner.bankAmount += (allCardsOwned ? 2 * card.rent[amount] : card.rent[amount]);
                }
                this.player.bankAmount -= card.rent[amount];
                card.owner.bankAmount += card.rent[amount];
            }
            if (card instanceof Companies_1.Companies) {
                if (amount <= card.multiplier.length && card.multiplier.length == 3) {
                    this.player.bankAmount -= dices * card.multiplier[amount];
                    card.owner.bankAmount += dices * card.multiplier[amount];
                }
                if (amount <= card.multiplier.length && card.multiplier.length == 5) {
                    this.cards.forEach(card => {
                        if (card instanceof Companies_1.Companies) {
                            if (card.bought) {
                                amount++;
                            }
                        }
                    });
                    this.player.bankAmount -= 25 * card.multiplier[amount - 1];
                    card.owner.bankAmount += 25 * card.multiplier[amount - 1];
                }
            }
        }
        this.endGame();
    }
    jailFee(amount, action, card) {
        let paid = false;
        if (!this.bankrupt(amount)) {
            switch (action) {
                case "jailFee":
                    this.player.inJail = false;
                    this.player.jailTime = 3;
                    this.player.bankAmount -= amount;
                    paid = true;
                    break;
                case "use card":
                    this.player.inJail = false;
                    this.player.jailTime = 3;
                    card === null || card === void 0 ? void 0 : card.players.forEach(player => {
                        if (player = this.player) {
                            player;
                        }
                    });
                    paid = true;
                    break;
            }
        }
        return paid;
    }
    auction(card, players, totalBid) {
        if (card.owner != null) {
            totalBid;
        }
        return totalBid;
    }
    loan() {
    }
    bankrupt(price) {
        return (this.player.bankAmount - price < 0);
    }
    endGame() {
        if (this.bankrupt(0)) {
            this.player.bankRupted = true;
        }
    }
    actionCard(card) {
    }
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map