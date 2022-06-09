import { PlayerType } from "../Player";
import { Passive } from "./CardsType";

class Cities extends Passive {
  rent: number[];
  buildingCost: number

  constructor(
    name: string,
    cost: number,
    rent: number[],
    buildingCost: number,
    mortage: boolean,
    position: number,
    owner: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.mortage = mortage;
    this.buildingCost= buildingCost;
    this.position = position;
    this.owner = owner;
  }
}

export { Cities }
