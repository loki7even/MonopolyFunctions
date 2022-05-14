import { Display } from "../Screen";
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
    display: Display
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.mortagePrice = mortagePrice;
    this.buildingCost= buildingCost;
  
    this.display = display;
  }
}

export { Cities }
