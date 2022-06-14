interface PlayerType {
  name: string;
  bankAmount: number;
  position: number;
  inJail: boolean;
  jailTime: number;
  bankRupted: boolean;
  ia: string | null;
}

export { PlayerType };
