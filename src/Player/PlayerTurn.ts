import { Actions } from "../Cards/Actions";
import { CardType, Passive } from "../Cards/CardsType";
import { Prison } from "../Cards/Prison";
import PlayerActions from "./PlayerAction";
import { PlayerType } from "./PlayerType";

class PlayerTurn {
    player: PlayerType;
    actions: PlayerActions = new PlayerActions();
    cards: CardType[];
    card: CardType | undefined;
    jailtime: number;

    constructor(player: PlayerType, cards : Array<CardType>, jailtime:number) {
        this.player = player;
        this.cards = cards;
        this.jailtime = jailtime
    }

    *turn(dices: number, prison: Prison) {
        let lauch =  this.actions.launchdice(dices)
        yield lauch

        if(prison.players.indexOf(this.player)==undefined)
            this.player = this.actions.movePlayer(this.player, lauch[1])
        else if(lauch[0][0] == lauch[0][1] || this.player.jailtime <= 0){
            prison.players.splice(prison.players.indexOf(this.player), 1)
            this.player.jailtime = this.jailtime
            yield prison
        } else {
            this.player.jailtime --;
        }

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