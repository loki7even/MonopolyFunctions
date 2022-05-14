import { PlayerType } from "../Player";
import { Display } from "../Screen";
import { Passive } from "./CardsType";

class Companies extends Passive {
  multiplier!: number[];

  constructor(
    name: string,
    cost: number,
    multiplier: number[],
    mortage: number,
    display: Display,
    owner?: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.multiplier = multiplier;
    this.mortagePrice = mortage
    this.display = display;
    this.owner = owner;
  }
}


export {Companies}