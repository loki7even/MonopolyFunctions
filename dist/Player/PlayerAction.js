"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cities_1 = require("../Cards/Cities");
const Companies_1 = require("../Cards/Companies");
class PlayerActions {
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
    pay(player, total) {
        if (player.bankAmount - total > 0)
            player.bankAmount - total;
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