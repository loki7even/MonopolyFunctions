"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Companies = void 0;
const CardsType_1 = require("./CardsType");
class Companies extends CardsType_1.Passive {
    constructor(name, cost, multiplier, mortage, position, owner) {
        super();
        this.name = name;
        this.cost = cost;
        this.multiplier = multiplier;
        this.mortagePrice = mortage;
        this.position = position;
        this.owner = owner;
    }
}
exports.Companies = Companies;
//# sourceMappingURL=Companies.js.map