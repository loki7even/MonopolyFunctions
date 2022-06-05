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
    changePlayer(players, playerPos) {
        playerPos += 1;
        if (players.length - 1 < playerPos)
            playerPos = 0;
        return playerPos;
    }
    checkMove(players, dices, jailTime, playerPos) {
        let inJailPlayer;
        if (dices[1] != dices[0]) {
            playerPos = this.changePlayer(players, playerPos);
        }
        else if (dices[1] == dices[0]) {
            players[playerPos].jailtime--;
        }
        else if (players[playerPos].jailtime == 0 || players[playerPos] == inJailPlayer) {
            inJailPlayer = players[playerPos];
            inJailPlayer.position = 10;
            inJailPlayer.jailtime++;
            if (inJailPlayer.jailtime == 3) {
                players[playerPos].jailtime = jailTime;
                inJailPlayer = undefined;
            }
            playerPos = this.changePlayer(players, playerPos);
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
    buy(player, total, card) {
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