interface PlayerType {
  name: string;
  bankAmount: number;
  loan: number;
  position: number;
  inJail: boolean;
  jailTime: number;
  bankRupted: boolean;
  bid: number;
  distribution: number[];
  ia: string | null;
}

export { PlayerType };
