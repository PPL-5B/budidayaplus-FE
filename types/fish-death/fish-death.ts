import User from "@/types/auth/user";

export type FishDeath = {
  id: string;
  pond_id: string;
  cycle_id: string;
  reporter: User;
  recorded_at: string;
  fish_death_count: number;
  fish_alive_count: number;
};
