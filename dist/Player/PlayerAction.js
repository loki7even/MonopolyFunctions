"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cities_1 = require("../Cards/Cities");
const Companies_1 = require("../Cards/Companies");
class PlayerActions {
    constructor(player, cards, inJail, startAmount) {
        this.player = player;
        this.cards = cards;
        this.inJail = inJail;
        this.startAmount = startAmount;
    }
    turn(dices) {
        let lauch = this.launchdice(dices);
        this.player = this.movePlayer(this.player, lauch[1], this.cards.length - 1, this.startAmount);
        let cards = this.cards.filter((card) => {
            return card.position == this.player.position;
        });
        if (cards.length != 1)
            throw new Error("Too many cards");
        this.card = cards[0];
        if (this.card)
            this.card = this.card;
        return [lauch[0], this.player, this.card];
    }
    changePlayer(players, playerPos, lock) {
        playerPos += 1;
        if (players.length - 1 < playerPos)
            playerPos = 0;
        lock = false;
        return playerPos;
    }
    checkMove(players, dices, playerPos, lock) {
        if (dices[1] != dices[0] && lock && players[playerPos].inJail == false) {
            players[playerPos].count = 3;
            playerPos = this.changePlayer(players, playerPos, lock);
        }
        else if (dices[1] == dices[0] && lock && players[playerPos].inJail == false) {
            players[playerPos].count -= 1;
            console.log(players[playerPos].count);
        }
        if (players[playerPos].count == 0 || players[playerPos].inJail == true) {
            this.inJailPlayer = players[playerPos];
            this.inJailPlayer.inJail = true;
            this.inJailPlayer.position = 10;
            this.inJailPlayer.count++;
            playerPos = this.changePlayer(players, playerPos, lock);
            console.log(this.inJailPlayer.count, this.inJailPlayer);
            if (this.inJailPlayer.count == 3) {
                this.inJailPlayer.inJail = false;
            }
        }
        return playerPos;
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
    movePlayer(player, move, lenBoard, startAmount) {
        player.position += move;
        if (player.position > lenBoard) {
            player.position -= lenBoard;
            player.bankAmount += startAmount;
        }
        return player;
    }
    buy(player, card) {
        if (card.owner == null) {
            if (player.bankAmount - card.cost > 0) {
                card.owner = player;
                player.bankAmount -= card.cost;
            }
        }
    }
    upgrade(player, card, allCardsOwned) {
        if (card.owner == player && allCardsOwned && player.bankAmount - card.cost > 0) {
            card.propreties += 1;
            if (card instanceof Cities_1.Cities)
                player.bankAmount -= card.buildingCost;
            if (card instanceof Companies_1.Companies)
                player.bankAmount -= card.cost;
        }
    }
    sell(player, card) {
        if (card.owner != null) {
            player.bankAmount += card.cost;
            card.owner = null;
        }
    }
    mortage(player, card) {
        if (card.owner != null) {
            card.mortage = true;
            player.bankAmount += card.cost / 2;
        }
    }
    auction(players, totalBid, player, card) {
        if (card.owner != null) {
            card.mortage = true;
            // card.
        }
        return players;
    }
    rent(player, card, amount, dices) {
        if (card.owner != null && card.owner != player) {
            if (card instanceof Cities_1.Cities && player.bankAmount - card.rent[amount] > 0) {
                player.bankAmount -= card.rent[amount];
                card.owner.bankAmount += card.rent[amount];
            }
            if (card instanceof Companies_1.Companies && player.bankAmount - dices * card.multiplier[amount] > 0) {
                if (amount <= card.multiplier.length)
                    player.bankAmount -= dices * card.multiplier[amount];
            }
        }
    }
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map