/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import Cards from './Cards';
import {Actions} from './CardTypes/Actions';
import {CardType, Passive} from './CardTypes/CardsType';
import {Cities} from './CardTypes/Cities';
import {Companies} from './CardTypes/Companies';
import {Prison} from './CardTypes/Prison';
import {PlayerType} from './Player';
import PlayerActions from './Player/PlayerAction';

export class Game {
  players: PlayerType[] = [];
  cards: CardType[] = [];

  playerIndex: number = 0;
  ndBices: number;
  center: number = 0;
  startAmount: number;
  inJail: boolean;
  lock: boolean = true;
  turnData!: (PlayerType | CardType | number[])[];
  owner?: PlayerType;
  canTurn?: boolean;
  canEnd?: boolean;
  prisonLaunch?: number[];

  constructor(players: Array<any> | string,
      cards: Array<any> = Cards.Cards_json,
      bankAmount = 1500,
      ndbices: number = 2,
      startAmount: number = 200,
      inJail:boolean = false, ...partyParam: any) {
    this.intiPlayers((players as string ? JSON.parse(players as string): players ), bankAmount);
    this.initCards(cards);
    this.ndBices = ndbices;
    this.startAmount = startAmount;
    this.inJail = inJail;
  }

  intiPlayers(players: Array<any>, bankAmount: number) {
    players.forEach((player) => {
      const playerObj : PlayerType = {
        name: (player as string ? JSON.parse(player): player ).name,
        bankAmount: bankAmount,
        loan: 2000,
        position: 0,
        inJail: false,
        jailTime: 3,
        bankRupted: false,
        bid: 0,
        distribution: this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], bankAmount) as unknown as number[],
        ia: player.ia,
      };
      this.players.push(playerObj);
    });
  }

  initCards(cards: Array<any>): void {
    cards.forEach((card) => {
      let cardObj: CardType | null = null;

      switch (card.type) {
        case 'action':
          cardObj = new Actions(card.name,
              card.actionType,
              card.action,
              card.description,
              card.pos);
          break;

        case 'cities':
          cardObj = new Cities(card.name,
              card.cost,
              card.rent,
              card.color,
              card.buildCost,
              card.mortage,
              card.pos,
              card.owner);
          break;
        case 'prison':
          cardObj = new Prison(card.name, card.description, card.position, card.owner);

        case 'companies':
          cardObj = new Companies(card.name,
              card.cost,
              card.multiplier, // [4, 10], [25, 50, 100, 200]
              card.mortgage,
              card.bought,
              card.pos,
              card.owner);
          break;

        default:
          break;
      }
      if (cardObj != null) this.cards.push(cardObj);
    });
  }

  getPlayer() {
    return this.players[this.playerIndex];
  }
  getPlayerName() {
    return this.getPlayer()?.name;
  }

  getCard(position : number) {
    let Card = this.cards[32];
    this.cards.forEach((card) =>{
      if (position == card.position) {
        Card = card;
      }
    });
    return Card;
  }

  // getActionCardsDescription() {
  //   return this.cards;
  // }

  getPlayerCards() {
    let cardList: string[] = [];
    this.cards.forEach((card) => {
      if (card instanceof Passive && card.owner == this.players[this.playerIndex]) {
        cardList.push(card.name);
      }
    });
    console.log(cardList);
    return cardList;
  }

  getCityCard(card: CardType) {
    return card as Cities;
  }

  allCardsOwned(cardColor? : string) {
    let count = 0;
    let specialCount = 0;
    let railRoadCount = 0;
    let taxeCount = 0;
    this.cards.forEach((card) =>{
      if (card instanceof Cities && card.owner != null && !card.mortage) {
        if (cardColor == card.color) {
          count++;
        }
        if (cardColor == 'blue') {
          specialCount++;
        }
        if (cardColor == 'brown') {
          specialCount++;
        }
      }
      if (card instanceof Companies && card.owner != null && !card.mortage) {
        if (card.multiplier.length == 3) {
          taxeCount++;
        }
        if (card.multiplier.length == 5) {
          railRoadCount++;
        }
      }
    });

    return (specialCount == 2 || count == 3 || railRoadCount == 4 || taxeCount == 2);
  }

  end() {
    let count = 0;
    this.players.forEach((player) =>{
      if (player.bankRupted) count++;
    });
    return (count == this.players.length - 1);
  }

  moneyDistribution(S: number[], X: number) {
    let max = S.length-1;
    let L: number[];
    L = [5, 5, 5, 6, 2, 2, 2];
    if (X >= 1500 ) X -= 1500;
    else {
      for (let i = 0; i < L.length; i++) {
        let countMemory = L[i];
        while (X-S[i] >= 0 && countMemory > 0) {
          X -= S[i];
          countMemory--;
        }
        L[i] -= countMemory;
      }
    }
    for (max; max > -1; max--) {
      let count = L[max];
      while (X - S[max] >= 0) {
        X -= S[max];
        count ++;
      }
      L[max] = count;
    }
    return L;
  }

  auction(card : Passive, bids? : number[]) {
    bids?.push(this.players[this.playerIndex].bid);
    if (bids && bids.length == this.players.length) {
      let finalBid = 0;
      bids.forEach((bid) => {
        if (bid> finalBid) {
          finalBid = bid;
        }
      });
      this.players.forEach((player) => {
        if (player.bid == finalBid && player.bid - finalBid > 0) {
          card.owner = player;
          player.bid = 0;
        }
      });
    }
  }

  turnActionsCard(card: Actions) {
    const playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);

    switch (card.actionType) {
      case 'luck':
        const randomLuck = Math.floor(Math.random() * 16);
        console.log(card.action[randomLuck]);
        switch (card.action[randomLuck].type) {
          case 'goto':
            if (this.players[this.playerIndex].position > card.action[randomLuck].position) this.players[this.playerIndex].bankAmount += this.startAmount;
            this.players[this.playerIndex].position = card.action[randomLuck].position;
            break;
          case 'pay':
            this.players[this.playerIndex].bankAmount += card.action[randomLuck].amount;
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            playerActions.endGame(this.players);
            break;

          case 'freeJail':
            let prison = this.getCard(10) as Prison;
            prison.owners.push(this.players[this.playerIndex]);
            break;

          case 'repair':
            this.cards.forEach((card) =>{
              if (card instanceof Cities && card.owner == this.players[this.playerIndex]) {
                if (card.propreties == 5) this.players[this.playerIndex].bankAmount -= 100;
                else {
                  this.players[this.playerIndex].bankAmount -= 25*card.propreties;
                }
              }
            });
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            playerActions.endGame(this.players);
            break;

          case 'inJail':
            this.players[this.playerIndex].inJail = true;
            this.players[this.playerIndex].jailTime = 0;
            this.players[this.playerIndex].position = 10;
            break;

          case 'goBack':
            this.players[this.playerIndex].position -= 3;
            if (this.players[this.playerIndex].position - 3 < 0) this.players[this.playerIndex].position = 40 + (this.players[this.playerIndex].position - 3);
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            break;

          case 'gotoUtility':
            if (this.players[this.playerIndex].position > 21) this.players[this.playerIndex].position = 38;
            else this.players[this.playerIndex].position = 4;
            const dices = this.turnData[0] as number[];
            const sumDices = dices[0] + dices[1];
            playerActions.rent(this.getCard(this.players[this.playerIndex].position) as Passive, 2, sumDices, true, this.players);
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            playerActions.endGame(this.players);
            break;

          case 'gotoRail':
            let count = 0;
            const railCard = this.getCard(this.players[this.playerIndex].position) as Companies;
            while (this.players[this.playerIndex].position - 10 > 0) {
              count++;
              this.players[this.playerIndex].position -= 10;
            }
            this.players[this.playerIndex].position = 5 + 10*count;
            playerActions.rent(this.getCard(this.players[this.playerIndex].position) as Passive, railCard.propreties, this.ndBices, true, this.players);
            playerActions.rent(this.getCard(this.players[this.playerIndex].position) as Passive, railCard.propreties, this.ndBices, true, this.players);
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            console.log(card.action[randomLuck].description);
            break;

          case 'chairman':
            this.players.forEach((player) => {
              if (player != this.players[this.playerIndex]) {
                this.players[this.playerIndex].bankAmount -= 50;
                player.bankAmount += 50;
              }
              this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], player.bankAmount);
            });
            playerActions.endGame(this.players);
            break;
        }
        break;

      case 'community':
        const randomCommunity = Math.floor(Math.random() * 16);
        console.log(card.action[randomCommunity]);
        switch (card.action[randomCommunity].type) {
          case 'goto':
            this.players[this.playerIndex].position = card.action[randomCommunity].position;
            break;
          case 'pay':
            this.players[this.playerIndex].bankAmount += card.action[randomCommunity].amount;
            this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
            playerActions.endGame(this.players);
            break;

          case 'freeJail':
            let prison = this.getCard(10) as Prison;
            prison.owners.push(this.players[this.playerIndex]);
            break;

          case 'repair':
            this.cards.forEach((card) =>{
              if (card instanceof Cities) {
                if (card.propreties == 5) this.players[this.playerIndex].bankAmount -= 115;
                else {
                  this.players[this.playerIndex].bankAmount -= 40*card.propreties;
                }
              }
            });
            playerActions.endGame(this.players);
            break;

          case 'inJail':
            this.players[this.playerIndex].inJail = true;
            this.players[this.playerIndex].jailTime = 1;
            this.players[this.playerIndex].position = 10;
            break;

          case 'birthday':
            this.players.forEach((player) => {
              if (player != this.players[this.playerIndex]) {
                player.bankAmount -= 10;
                this.players[this.playerIndex].bankAmount += 10;
              }
            });
            playerActions.endGame(this.players);
            break;
        }
        break;
      case 'inJail':
        this.players[this.playerIndex].inJail = true;
        this.players[this.playerIndex].jailTime = 1;
        this.players[this.playerIndex].position = 10;
        break;
      case 'start':
        this.players[this.playerIndex].bankAmount += this.startAmount;
        break;
      case 'taxe':
        this.players[this.playerIndex].bankAmount -= 200;
      default:
        break;
    }
  }

  turn() {
    if (this.lock && !this.players[this.playerIndex].bankRupted || this.canEnd && !this.players[this.playerIndex].bankRupted) {
      this.lock = false;
      const playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
      const card = this.getCard(this.players[this.playerIndex].position) as Cities;
      let prisonLaunch;
      this.canTurn = true;

      if (!this.players[this.playerIndex].inJail) {
        this.turnData = playerActions.turn(this.ndBices,
            this.allCardsOwned(card.color), this.players);
        this.canEnd = playerActions.checkMove(this.turnData[0] as number[]);
        this.players[this.playerIndex] = playerActions.jailed();
      }

      this.owner = this.players[this.playerIndex];

      if (this.players[this.playerIndex].inJail) {
        if (!this.players[this.playerIndex].jailTime) {
          this.canTurn = false;
          this.owner = undefined;
          this.players[this.playerIndex].jailTime++;
          this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
        } else {
          prisonLaunch = playerActions.launchdice(this.ndBices)[0];
          if (playerActions.checkJail(prisonLaunch)) this.lock = false;
          else if (this.players[this.playerIndex].jailTime - 1 < 3) {
            this.lock = true;
            this.canTurn = false;
            this.owner = undefined;
            if (this.players[this.playerIndex].jailTime <= 3) this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
          }
        }
      }

      if (this.getCard(this.players[this.playerIndex].position) instanceof Actions) this.turnActionsCard(this.getCard(this.players[this.playerIndex].position) as Actions);

      this.prisonLaunch = prisonLaunch;
      if (this.owner) this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
      return this.turnData;
    }

    if (this.end()) {
      return this.players[this.playerIndex];
    }
  }

  // eslint-disable-next-line require-jsdoc
  checkAction(action : string, bids? : number[], player?: PlayerType, amount? : number) {
    const playerActions = new PlayerActions(this.players[this.playerIndex], this.cards, this.inJail, this.startAmount);
    const card = this.getCard(this.players[this.playerIndex].position) as Cities;
    const auctionCard = this.getCard(this.players[this.playerIndex].position) as Passive;

    let paid;
    switch (action) {
      case 'pay jail fee':
        paid = playerActions.jailFee(50, 'jailFee');
        if (playerActions.checkJail(this.prisonLaunch, paid)) this.lock = false;
        break;
      case 'use card':
        paid = playerActions.jailFee(50, 'use card', this.getCard(10) as Prison);
        if (playerActions.checkJail(this.prisonLaunch, paid)) this.lock = false;
        this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
        break;

      case 'end turn':
        this.lock = true;
        this.owner = undefined;
        if (this.players[this.playerIndex].bankRupted) this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
        if (!this.players[this.playerIndex].inJail && this.canTurn && !this.canEnd) {
          if (auctionCard.owner == null ) this.auction(auctionCard, bids);
          this.players[this.playerIndex].distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.playerIndex = playerActions.changePlayer(this.players, this.playerIndex);
        }
        this.canTurn = false;
        break;
    }

    if (this.getCard(this.players[this.playerIndex].position) instanceof Cities && this.owner != undefined && this.allCardsOwned(card.color)) {
      switch (action) {
        case 'upgrade':
          playerActions.upgrade(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;
      }
    }

    if ((this.getCard(this.players[this.playerIndex].position) instanceof Cities || this.getCard(this.players[this.playerIndex].position) instanceof Companies) && this.owner != undefined) {
      switch (action) {
        case 'buy':
          playerActions.buy(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'sell property':
          playerActions.sellProperty(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'mortage':
          playerActions.mortage(this.getCard(this.players[this.playerIndex].position) as Passive, this.allCardsOwned(card.color));
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'unmortage':
          playerActions.unMortage(this.getCard(this.players[this.playerIndex].position) as Passive);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'sell building':
          playerActions.sellBuilding(this.getCard(this.players[this.playerIndex].position) as Cities);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'sell all buildings':
          playerActions.sellAllBuildings(card.color);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'trade':
          playerActions.trade(this.getCard(this.players[this.playerIndex].position) as Passive, player);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'loan money':
          playerActions.loan(amount);
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;

        case 'pay loan':
          playerActions.payLoan();
          this.owner.distribution = this.moneyDistribution([1, 5, 10, 20, 50, 100, 500], this.players[this.playerIndex].bankAmount);
          this.owner = undefined;
          break;
      }
    }
  }
}

class Json {
  constructor(json :string ) {
    Object.assign(this, JSON.parse(json));
  }
}

export function transform(json : string, game: Game) {
  const jsonClass = new Json(json);
  Object.setPrototypeOf(jsonClass, game);
  return game;
}
