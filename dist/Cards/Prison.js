"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prison = void 0;
const Actions_1 = require("./Actions");
class Prison extends Actions_1.Actions {
    constructor(name, actionType, description, position, players = []) {
        super(name, actionType, description, position);
        this.name = name;
        this.actionType = actionType;
        this.description = description;
        this.position = position;
        this.players = [];
    }
}
exports.Prison = Prison;
//# sourceMappingURL=Prison.js.map