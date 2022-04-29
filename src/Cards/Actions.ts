import { Display } from "../Screen";
import { CardType } from "./CardsType";

class Actions implements CardType {
  name!: string;
  actionType!: string;
  description!: string;
  display!: Display;

  constructor(
    name: string,
    actionType: string,
    description: string,
    display: Display
  ) {
    this.name = name;
    this.actionType = actionType;
    this.description = description;
    this.display = display;
  }
}

export { Actions };
