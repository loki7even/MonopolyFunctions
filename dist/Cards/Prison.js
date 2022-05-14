"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prison = void 0;
const Actions_1 = require("./Actions");
class Prison extends Actions_1.Actions {
    constructor(name, actionType, description, display, players) {
        super(name, actionType, description, display);
        this.name = name;
        this.actionType = actionType;
        this.description = description;
        this.display = display;
        this.players = [];
    }
}
exports.Prison = Prison;
//# sourceMappingURL=Prison.js.map