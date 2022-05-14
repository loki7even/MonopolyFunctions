import { PlayerType } from "../Player";
import { Display } from "../Screen";
import { Passive } from "./CardsType";

class Companies extends Passive {
  multiplier!: number[];
  initialCost!: number;

  constructor(
    name: string,
    cost: number,
    multiplier: number[],
    initialCost: number,
    display: Display,
    owner?: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.multiplier = multiplier;
    this.initialCost = initialCost;
    this.display = display;
    this.owner = owner;
  }

  private fuck() {
    return "fuck";
  }
}


export {Companies}