import User from "@/types/auth/user";
import { ForumTag } from "./forumSchema";

export type Forum = {
    id: string;
    user: User;
    title: string;
    description: string;
    tag: ForumTag;
    timestamp: Date;
    parent_id: string | null;
    replies: Forum[];
    upvotes: number;
    downvotes: number;
};

