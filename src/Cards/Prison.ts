import { PlayerType } from "../Player";
import { Actions } from "./Actions";
import { CardType, Passive } from "./CardsType";

class Prison implements CardType{
  name!: string;
  description!: string;
  position!: number;
  owners!: PlayerType[];

  constructor(
    name: string,
    description: string,
    position: number,
    owners: PlayerType[]
  ) {
    this.name = name;
    this.description = description;
    this.position = position;
    this.owners = owners;
  }
}

export { Prison }