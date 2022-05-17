import { CardType } from "./CardsType";

class Actions implements CardType {
  name!: string;
  actionType!: string;
  description!: string;
  position: number;

  constructor(
    name: string,
    actionType: string,
    description: string,
    position: number
  ) {
    this.name = name;
    this.actionType = actionType;
    this.description = description;
    this.position=  position;
  }
}

export { Actions };
