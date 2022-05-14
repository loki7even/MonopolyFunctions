"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    movePlayer(player, move) {
        player.display.position += move;
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
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map