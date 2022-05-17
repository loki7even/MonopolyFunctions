import { PlayerType } from "../Player";
import { Actions } from "./Actions";

class Prison extends Actions {
  players: PlayerType[];

  constructor(
    name: string,
    actionType: string,
    description: string,
    position: number,
    players: PlayerType[] = []
  ) {
    super(name, actionType, description, position);
    this.name = name;
    this.actionType = actionType;
    this.description = description;
    this.position = position;
    this.players = [];
  }
}

export { Prison }