import { PlayerType } from "../Player";
interface CardType {
  name: string;
  description: string;
  position: number;
}

abstract class Passive implements CardType {
  name!: string;
  owner?: PlayerType;
  cost!: number;
  mortagePrice!: number;
  description!: string;
  position!: number;
  propreties: number = 0;
}

export { CardType, Passive };
