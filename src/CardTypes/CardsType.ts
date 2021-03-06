import { PlayerType } from "../Player";
interface CardType {
  name: string;
  description: string;
  position: number;  
}

abstract class Passive implements CardType {
  name!: string;
  owner!: PlayerType | null;
  cost!: number;
  mortage: boolean = false;
  description!: string;
  position!: number;
  propreties: number = 0;
}

export { CardType, Passive };
