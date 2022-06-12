import { PlayerType } from "../Player";
import { Passive } from "./CardsType";

class Companies extends Passive {
  multiplier!: number[];
  bought!: boolean;

  constructor(
    name: string,
    cost: number,
    multiplier: number[],
    mortage: boolean,
    bought: boolean,
    position: number,
    owner: PlayerType
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.multiplier = multiplier;
    this.mortage = mortage;
    this.bought = bought;
    this.position = position;
    this.owner = owner;
  }
}


export {Companies}