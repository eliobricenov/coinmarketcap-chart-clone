export type BitcoinData = {
  price: number;
  volume: number;
  date: Date;
};

export type Timeframe = "1d" | "1w" | "1m" | "1y" | "all";
