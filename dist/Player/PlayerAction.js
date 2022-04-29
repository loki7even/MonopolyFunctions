"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function launchdice(nbDice) {
    const dice = [];
    let sum = 0;
    do {
        const rd = randomIntFromInterval(1, 6);
        dice.push(rd);
        sum += rd;
    } while (nbDice-- >= 0);
    return [dice, sum];
}
function movePlayer(player, nbDice) {
    return (player.display.position += launchdice(nbDice)[1]);
}
function pay(player, total) {
    if (player.bankAmount - total > 0)
        player.bankAmount - total;
    return player;
}
function sell(player, total) {
    player.bankAmount + total;
    return player;
}
function bid(players, totalBid) {
    return players;
}
//# sourceMappingURL=PlayerAction.js.map