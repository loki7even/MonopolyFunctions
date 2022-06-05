"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cities = void 0;
const CardsType_1 = require("./CardsType");
class Cities extends CardsType_1.Passive {
    constructor(name, cost, rent, buildingCost, mortagePrice, position, owner) {
        super();
        this.name = name;
        this.cost = cost;
        this.rent = rent;
        this.mortagePrice = mortagePrice;
        this.buildingCost = buildingCost;
        this.position = position;
        this.owner = owner;
    }
}
exports.Cities = Cities;
//# sourceMappingURL=Cities.js.map