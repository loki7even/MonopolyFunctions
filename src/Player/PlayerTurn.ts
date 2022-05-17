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

    turn(dices: number, prison: Prison) {
        let p = undefined;
        let lauch =  this.actions.launchdice(dices)
        

        if(prison.players.indexOf(this.player)==undefined)
            this.player = this.actions.movePlayer(this.player, lauch[1])
        else if(lauch[0][0] == lauch[0][1] || this.player.jailtime <= 0){
            p = prison.players.splice(prison.players.indexOf(this.player), 1)
            
            this.player.jailtime = this.jailtime
        } else {
            this.player.jailtime --;
        }

        let cards = this.cards.filter((card) => {
            return card.position == this.player.position  
        })
        
        if(cards.length!=1) throw new Error("To many cards");
        
        this.card = cards[0]

        if(this.card as Actions) {
            this.card = this.card as  Actions
        } 
        
        return [lauch[0], this.player, this.card, p]
    }
}

export default PlayerTurn;