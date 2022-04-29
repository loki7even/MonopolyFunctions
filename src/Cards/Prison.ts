import { PlayerType } from "../Player";
import { Display } from "../Screen";
import { Actions } from "./Actions";

class Prison extends Actions {
  owner?: PlayerType;

  constructor(
    name: string,
    actionType: string,
    description: string,
    display: Display,
    owner?: PlayerType
  ) {
    super(name, actionType, description, display);
    this.name = name;
    this.actionType = actionType;
    this.description = description;
    this.display = display;
    this.owner = owner;
  }
}
