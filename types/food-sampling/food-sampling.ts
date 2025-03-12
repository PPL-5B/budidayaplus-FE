import User from "@/types/auth/user";

export type FoodSampling = {
    sampling_id: string;
    pond_id: string;
    cycle_id: string;
    reporter: User;
    food_quantity: number;
    recorded_at: Date;
    target_food_quantity: number;
};
