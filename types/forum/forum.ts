import User from "@/types/auth/user";

export type Forum = {
    id: string;
    user: User;
    description: string;
    timestamp: Date;
    parent_id: string | null;
    replies: Forum[];
    upvotes: number;
    downvotes: number;
};

