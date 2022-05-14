"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cities = void 0;
const CardsType_1 = require("./CardsType");
class Cities extends CardsType_1.Passive {
    constructor(name, cost, hotelPrice, housePrice, hipoPrice, display) {
        super();
        this.name = name;
        this.cost = cost;
        this.hotelPrice = hotelPrice;
        this.housePrice = housePrice;
        this.hipoPrice = hipoPrice;
        this.display = display;
    }
    fuck() {
        return "fuck";
    }
}
exports.Cities = Cities;
//# sourceMappingURL=Cities.js.map