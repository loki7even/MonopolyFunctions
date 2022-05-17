import { PlayerType } from "../Player";
import { Passive } from "./CardsType";

class Companies extends Passive {
  multiplier!: number[];

  constructor(
    name: string,
    cost: number,
    multiplier: number[],
    mortage: number,
    position: number,
    owner?: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.multiplier = multiplier;
    this.mortagePrice = mortage
    this.position = position;
    this.owner = owner;
  }
}


export {Companies}