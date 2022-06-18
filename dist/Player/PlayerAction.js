"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const CardsType_1 = require("../Cards/CardsType");
const Cities_1 = require("../Cards/Cities");
const Companies_1 = require("../Cards/Companies");
class PlayerActions {
    constructor(player, cards, inJail, startAmount) {
        this.player = player;
        this.cards = cards;
        this.inJail = inJail;
        this.startAmount = startAmount;
    }
    turn(dices, allCardsOwned, players) {
        let launch = this.launchdice(dices);
        this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
        let cards = this.cards.filter((card) => {
            return card.position == this.player.position;
        });
        if (cards.length != 1)
            throw new Error("Too many cards");
        this.card = cards[0];
        if (this.card instanceof CardsType_1.Passive && this.card.owner != null)
            this.rent(this.card, this.card.propreties, launch[1], allCardsOwned, players);
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
        return false;
    }
    jailed() {
        if (this.player.jailTime == 0) {
            this.player.inJail = true;
            this.player.position = 10;
        }
        return this.player;
    }
    checkJail(launch, paid) {
        if (launch) {
            if (launch[0] == launch[1]) {
                this.player.inJail = false;
                this.player.jailTime = 3;
                this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
                return true;
            }
            if (this.player.jailTime < 5)
                this.player.jailTime++;
            if ((this.player.jailTime >= 3 && paid) || (this.player.jailTime >= 3 && this.player.inJail && paid)) {
                this.player.inJail = false;
                this.player = this.movePlayer(launch[1], this.cards.length - 1, this.startAmount);
                return true;
            }
        }
        return false;
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
        if (this.player.position > lenBoard) {
            this.player.position -= lenBoard;
            if (this.player.position != 0)
                this.player.bankAmount += startAmount;
        }
        return this.player;
    }
    buy(card) {
        if (card.owner == null && !this.bankrupt(this.player, card.cost)) {
            if (card instanceof Companies_1.Companies && card.propreties < card.multiplier.length && !card.bought) {
                card.propreties += 1;
                card.bought = true;
            }
            card.owner = this.player;
            this.player.bankAmount -= card.cost;
        }
    }
    upgrade(card) {
        if (card.owner == this.player && !this.bankrupt(this.player, card.cost)) {
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
            if (card.propreties == 5)
                this.player.bankAmount += 4 * (card.buildCost / 2);
            this.player.bankAmount += card.buildCost / 2;
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
        if (card.mortage && !this.bankrupt(this.player, ((card.cost / 2) + ((card.cost / 2) * 0.1)))) {
            card.mortage = false;
            this.player.bankAmount -= ((card.cost / 2) + ((card.cost / 2) * 0.1));
        }
    }
    rent(card, amount, dices, allCardsOwned, players) {
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
        this.endGame(players);
    }
    jailFee(amount, action, card) {
        let paid = false;
        if (!this.bankrupt(this.player, amount)) {
            switch (action) {
                case "jailFee":
                    this.player.inJail = false;
                    this.player.jailTime = 3;
                    this.player.bankAmount -= amount;
                    paid = true;
                    break;
                case "use card":
                    if ((card === null || card === void 0 ? void 0 : card.owners) != null && card.owners.includes(this.player)) {
                        this.player.inJail = false;
                        this.player.jailTime = 3;
                        let temp;
                        let count = 1;
                        card === null || card === void 0 ? void 0 : card.owners.forEach(player => {
                            temp.push(player);
                            if (player == this.player && count > 0) {
                                temp.pop();
                                count--;
                            }
                        });
                        card.owners = temp;
                    }
                    paid = true;
                    break;
            }
        }
        return paid;
    }
    bid(amount) {
        if (this.player.bankAmount - amount > 0) {
            return amount;
        }
    }
    loan(amount) {
        if (amount && this.player.loan - amount > 0) {
            this.player.bankAmount += amount;
            this.player.loan -= amount;
        }
    }
    payLoan() {
        if ((this.player.bankAmount - 2000 - this.player.loan) > 0) {
            this.player.bankAmount -= (2000 - this.player.loan);
            this.player.loan = 2000;
        }
    }
    trade(card, player) {
        if (player && card.owner == this.player && player.bankAmount - player.bid > 0) {
            card.owner = player;
            player.bankAmount -= player.bid;
            this.player.bankAmount += player.bid;
            player.bid = 0;
        }
    }
    bankrupt(player, price) {
        return (this.player.bankAmount - price < 0);
    }
    endGame(players) {
        players.forEach(player => {
            if (this.bankrupt(player, 0)) {
                player.bankRupted = true;
            }
        });
    }
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map