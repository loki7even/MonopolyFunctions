"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = require("./Actions");
class Prison extends Actions_1.Actions {
    constructor(name, actionType, description, display, owner) {
        super(name, actionType, description, display);
        this.name = name;
        this.actionType = actionType;
        this.description = description;
        this.display = display;
        this.owner = owner;
    }
}
//# sourceMappingURL=Prison.js.map