import { BitcoinData, Timeframe } from "../types.ts";
import { ONE_DAY_DATA } from "./one-day.ts";
import { ONE_WEEK_DATA } from "./one-week.ts";
import { ONE_YEAR_DATA } from "./one-year.ts";
import { ONE_MONTH_DATA } from "./one-month.ts";
import { ALL_TIME_DATA } from "./all-time.ts";

export const BITCOIN_DATA: Record<Timeframe, BitcoinData[]> = {
  "1d": ONE_DAY_DATA,
  "1w": ONE_WEEK_DATA,
  "1m": ONE_MONTH_DATA,
  "1y": ONE_YEAR_DATA,
  all: ALL_TIME_DATA,
};
