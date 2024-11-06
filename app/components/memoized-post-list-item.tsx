import { memo } from 'react';
import type { CombinedPostWithAuthorAndLikes } from '~/lib/types';
import { Post } from './posts';
import { ViewLikes } from './view-likes';
import { ViewComments } from './view-comments';
import { formatToTwitterDate } from '~/lib/utils';
import { useLocation } from '@remix-run/react';

export const MemoizedPostListItem = memo(({ post, index }: { post: CombinedPostWithAuthorAndLikes; index: number }) => {
  const location = useLocation();
  let pathnameWithSearchQuery = '';

  if (location.search) {
    pathnameWithSearchQuery = `${location.pathname}/${post.id}${location.search}`;
  } else {
    pathnameWithSearchQuery = `${location.pathname}/${post.id}`;
  }

  const postCreatedAt = formatToTwitterDate(post.created_at, 'en');

  return (
    <Post id={post.id} avatarUrl={post.author.avatar_url} userId={post.author.id} name={post.author.name} username={post.author.username} title={post.title} dateTimeString={postCreatedAt}>
      <ViewLikes likes={post.likes.length} likeByUser={post.isLikedByUser} pathname={pathnameWithSearchQuery} />
      <ViewComments comments={post.comments.length} pathname={pathnameWithSearchQuery} />
    </Post>
  );
});

MemoizedPostListItem.displayName = 'MemoizedPostListItem';
