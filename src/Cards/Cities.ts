import { PlayerType } from "../Player";
import { Passive } from "./CardsType";

class Cities extends Passive {
  rent: number[];
  buildCost: number;
  color: string;

  constructor(
    name: string,
    cost: number,
    rent: number[],
    color: string,
    buildCost: number,
    mortage: boolean,
    position: number,
    owner: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.color = color;
    this.mortage = mortage;
    this.buildCost= buildCost;
    this.position = position;
    this.owner = owner;
  }
}

export { Cities }
