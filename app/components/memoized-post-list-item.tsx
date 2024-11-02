import { memo } from 'react';
import type { CombinedPostWithAuthorAndLikes } from '~/lib/types';
import { Post } from './posts';
import { ViewLikes } from './view-likes';
import { ViewComments } from './view-comments';
import { formatToTwitterDate } from '~/lib/utils';

export const MemoizedPostListItem = memo(({ post, index }: { post: CombinedPostWithAuthorAndLikes; index: number }) => {
  const postCreatedAt = formatToTwitterDate(post.created_at, 'en');

  return (
    <Post id={post.id} avatarUrl={post.author.avatar_url} userId={post.author.id} name={post.author.name} username={post.author.username} title={post.title} dateTimeString={postCreatedAt}>
      <ViewLikes likes={post.likes.length} likeByUser={post.isLikedByUser} pathname={`/profile/${post.author.username}`} />
      <ViewComments number={post.comments.length} pathname={`/profile/${post.author.username}`} />
    </Post>
  );
});

MemoizedPostListItem.displayName = 'MemoizedPostListItem';