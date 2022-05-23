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
    turn(dices, prison) {
        let p = undefined;
        let lauch = this.launchdice(dices);
        // if(prison.players.indexOf(this.player)==undefined)
        this.player = this.movePlayer(this.player, lauch[1], this.cards.length - 1, this.startAmount);
        // else if(lauch[0][0] == lauch[0][1] || this.player.jailtime <= 0){
        //     p = prison.players.splice(prison.players.indexOf(this.player), 1)
        //     this.player.jailtime = this.jailtime
        // } else {
        //     this.player.jailtime --;
        // }
        let cards = this.cards.filter((card) => {
            return card.position == this.player.position;
        });
        if (cards.length != 1) {
            console.log(this.player.position);
            console.log(cards);
            throw new Error("Too many cards");
        }
        this.card = cards[0];
        if (this.card) {
            this.card = this.card;
        }
        return [lauch[0], this.player, this.card, p];
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
    buy(player, total) {
        if (player.bankAmount - total > 0)
            player.bankAmount -= total;
        return player;
    }
    sell(player, total) {
        player.bankAmount + total;
        return player;
    }
    bid(players, totalBid) {
        return players;
    }
    getPropreties(player, cards) {
        cards.filter(card => {
            if (card instanceof Cities_1.Cities) {
                let card2 = card;
                return card2.owner == player;
            }
            else if (card instanceof Companies_1.Companies) {
                let card2 = card;
                return card2.owner == player;
            }
            return false;
        });
    }
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map