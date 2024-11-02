import type { Database } from 'database.types';
import { combinePostsWithLikes } from './utils';

type Post = Database['public']['Tables']['posts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

type Like = {
  user_id: string;
};

export type PostWithDetails = Post & {
  author: Profile | null;
  likes: Like[];
  comments: Comment[];
};

export type CombinedPostsWithAuthorAndLikes = ReturnType<typeof combinePostsWithLikes>;

export type CombinedPostWithAuthorAndLikes = CombinedPostsWithAuthorAndLikes[number];
