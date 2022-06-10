"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cities = void 0;
const CardsType_1 = require("./CardsType");
class Cities extends CardsType_1.Passive {
    constructor(name, cost, rent, buildCost, mortage, position, owner) {
        super();
        this.name = name;
        this.cost = cost;
        this.rent = rent;
        this.mortage = mortage;
        this.buildCost = buildCost;
        this.position = position;
        this.owner = owner;
    }
}
exports.Cities = Cities;
//# sourceMappingURL=Cities.js.map