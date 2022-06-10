import { PlayerType } from "../Player";
import { Passive } from "./CardsType";

class Cities extends Passive {
  rent: number[];
  buildCost: number;

  constructor(
    name: string,
    cost: number,
    rent: number[],
    buildCost: number,
    mortage: boolean,
    position: number,
    owner: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.mortage = mortage;
    this.buildCost= buildCost;
    this.position = position;
    this.owner = owner;
  }
}

export { Cities }
