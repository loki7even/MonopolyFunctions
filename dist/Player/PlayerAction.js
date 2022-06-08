"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cities_1 = require("../Cards/Cities");
const Companies_1 = require("../Cards/Companies");
class PlayerActions {
    constructor(player, cards, jailtime, startAmount) {
        this.player = player;
        this.cards = cards;
        this.jailtime = jailtime;
        this.startAmount = startAmount;
    }
    turn(dices, lock) {
        if (lock) {
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
        lock = false;
        return [[0, 0]];
    }
    changePlayer(players, playerPos, lock) {
        if (lock) {
            playerPos += 1;
            if (players.length - 1 < playerPos)
                playerPos = 0;
            lock != lock;
        }
        return playerPos;
    }
    checkMove(players, dices, jailTime, playerPos, lock) {
        let inJailPlayer;
        if (dices[1] != dices[0] && lock) {
            playerPos = this.changePlayer(players, playerPos, lock);
        }
        else if (dices[1] == dices[0] && lock) {
            players[playerPos].jailtime--;
        }
        else if ((players[playerPos].jailtime == 0 || players[playerPos] == inJailPlayer) && lock) {
            inJailPlayer = players[playerPos];
            inJailPlayer.position = 10;
            inJailPlayer.jailtime++;
            if (inJailPlayer.jailtime == 3) {
                players[playerPos].jailtime = jailTime;
                inJailPlayer = undefined;
            }
            playerPos = this.changePlayer(players, playerPos, lock);
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
        if ((card instanceof Cities_1.Cities || card instanceof Companies_1.Companies) && card.owner == null) {
            if (player.bankAmount - card.cost > 0) {
                card.owner = player;
                player.bankAmount -= card.cost;
            }
        }
    }
    upgrade(card) {
        if (card.owner != null) {
        }
    }
    sell(player, card) {
        if ((card instanceof Cities_1.Cities || card instanceof Companies_1.Companies) && card.owner != null) {
            player.bankAmount += card.cost;
            card.owner = null;
        }
    }
    bid(players, totalBid, player, card) {
        if ((card instanceof Cities_1.Cities || card instanceof Companies_1.Companies) && card.owner != null) {
            player.bankAmount += card.cost;
            card.owner = null;
        }
        return players;
    }
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map