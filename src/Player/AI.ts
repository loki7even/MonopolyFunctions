import PlayerType from "./PlayerType"
getAllCards (players: PlayerType[]) => {
    return 
    cards.filter(card => {
        if(card instanceof Cities) {
          let card2 = card as Cities
          return card2.owner == player
        } else if(card instanceof Companies) 
        {
          let card2 = card as Companies
          return card2.owner == player
        }
        return false
      })
    
} 

export class easy()  extends {

}

export class medium() {

}

export class hard() {

}