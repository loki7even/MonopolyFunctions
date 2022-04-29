import { PlayerType } from "../Player";
import { Display } from "../Screen";

interface CardType {
  name: string;
  description: string;
}

abstract class Passive implements CardType {
  name!: string;
  owner?: PlayerType;
  cost!: number;
  description!: string;
  display!: Display;
  private show() {
    return "fuck";
  }
}

export { CardType, Passive };
