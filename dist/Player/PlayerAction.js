"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerActions {
    constructor(player, cards, jailtime, startAmount) {
        this.player = player;
        this.cards = cards;
        this.jailtime = jailtime;
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
    checkMove(players, dices, jailTime, position) {
        let inJailPlayer;
        if (dices[1] != dices[0] && players[position].jailtime != 0 && players != inJailPlayer) {
            position += 1;
            if (players.length - 1 < position)
                position = 0;
        }
        else if (dices[1] == dices[0] && players[position].jailtime != 0 && players[position] != inJailPlayer) {
            players[position].jailtime--;
        }
        else if (players[position].jailtime == 0 || players[position] == inJailPlayer) {
            inJailPlayer = players[position];
            inJailPlayer.position = 10;
            inJailPlayer.jailtime++;
            if (inJailPlayer.jailtime == 3) {
                players[position].jailtime = jailTime;
                inJailPlayer = undefined;
            }
            position += 1;
            if (players.length - 1 < position)
                position = 0;
        }
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
}
exports.default = PlayerActions;
//# sourceMappingURL=PlayerAction.js.map