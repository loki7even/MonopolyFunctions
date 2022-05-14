"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Companies = void 0;
const CardsType_1 = require("./CardsType");
class Companies extends CardsType_1.Passive {
    constructor(name, cost, multiplier, initialCost, display, owner) {
        super();
        this.name = name;
        this.cost = cost;
        this.multiplier = multiplier;
        this.initialCost = initialCost;
        this.display = display;
        this.owner = owner;
    }
    fuck() {
        return "fuck";
    }
}
exports.Companies = Companies;
//# sourceMappingURL=Companies.js.map