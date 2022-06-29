import { CardType } from "./CardsType";

class Actions implements CardType {
  name!: string;
  actionType!: string;
  action!: Array<any>;
  description!: string;
  position: number;

  constructor(
    name: string,
    actionType: string,
    action: Array<any>,
    description: string,
    position: number
  ) {
    this.name = name;
    this.actionType = actionType;
    this.action = action;
    this.description = description;
    this.position=  position;
  }
}

export { Actions };
