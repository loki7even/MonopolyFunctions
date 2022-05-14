import { Display } from "../Screen";
import { Passive } from "./CardsType";

class Cities extends Passive {
  hotelPrice: number;
  housePrice: number;
  hipoPrice: number;

  constructor(
    name: string,
    cost: number,
    hotelPrice: number,
    housePrice: number,
    hipoPrice: number,
    display: Display
  ) {
    super();
    this.name = name;
    this.cost = cost;
    this.hotelPrice = hotelPrice;
    this.housePrice = housePrice;
    this.hipoPrice = hipoPrice;
    this.display = display;
  }

  private fuck() {
    return "fuck";
  }
}

export { Cities }
