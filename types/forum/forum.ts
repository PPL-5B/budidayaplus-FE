import User from "@/types/auth/user";

export type Forum = {
    id: string;
    user: User;
    title?: string;
    description: string;
    tag: "ikan" | "kolam" | "siklus" | "budidayaplus";
    timestamp: Date;
    parent_id: string | null;
    replies: Forum[]; 
    upvotes: number;
    downvotes: number;
};

