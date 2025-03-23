import User from "@/types/auth/user";

export type FishDeath = {
    sampling_id: string;
    pond_id: string;
    cycle_id: string;
    reporter: User;
    fish_death_count: number;
    fish_alive_count: number;
    recorded_at: Date;
};