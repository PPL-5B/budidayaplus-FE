import { FishDeath } from "./fish-death";

export type FishDeathHistory = {
  fish_deaths: FishDeath[];
  cycle_id: string;
};