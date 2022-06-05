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
    mortagePrice: number,
    position: number,
    owner: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.mortagePrice = mortagePrice;
    this.buildingCost= buildingCost;
    this.position = position;
    this.owner = owner;
  }
}

export { Cities }
