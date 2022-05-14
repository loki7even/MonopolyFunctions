import { Actions } from "../Cards/Actions";
import { CardType, Passive } from "../Cards/CardsType";
import PlayerActions from "./PlayerAction";
import { PlayerType } from "./PlayerType";

class PlayerTurn {
    player: PlayerType;
    actions: PlayerActions = new PlayerActions();
    cards: CardType[];
    card: CardType | undefined;

    constructor(player: PlayerType, cards : Array<CardType>) {
        this.player = player;
        this.cards = cards;
    }

    *turn(dices: number) {
        let lauch =  this.actions.launchdice(dices)
        yield lauch
        this.player = this.actions.movePlayer(this.player, lauch[1])
        yield this.player
        let cards = this.cards.filter((card) => {
            return card.display.position == this.player.display.position  
        })
        
        if(cards.length!=1) throw new Error("To many cards");
        
        this.card = cards[0]

        if(this.card as Actions) {
            this.card = this.card as  Actions
        } 
        
        yield this.card
    }
}

export default PlayerTurn;