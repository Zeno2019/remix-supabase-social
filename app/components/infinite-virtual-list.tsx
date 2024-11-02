import type { CombinedPostsWithAuthorAndLikes } from '~/lib/types';
import { useInfinitePosts } from './use-infinite-posts';
import { Virtuoso } from 'react-virtuoso';
import { MemoizedPostListItem } from './memoized-post-list-item';
import {  AppLogo } from '~/components/app-logo';
import { PostSkeleton } from './posts';

export function InfiniteVirtualList({ totalPages, incomingPosts }: { totalPages: number; incomingPosts: CombinedPostsWithAuthorAndLikes }) {
  const { posts, loadMore, hasMorePages } = useInfinitePosts({
    incomingPosts,
    totalPages,
  });

  if (!posts.length) {
    return (
      <div className='flex justify-center items-center h-[50vh]'>
        <AppLogo className='size-10' />
        <h2 className='ml-2'>No posts found!</h2>
      </div>
    );
  }

  return (
    <Virtuoso
      data={posts}
      useWindowScroll
      initialTopMostItemIndex={0}
      endReached={loadMore}
      initialItemCount={5}
      overscan={500}
      itemContent={(index, post) => {
        if (!post) {
          return <div />;
        }

        return <MemoizedPostListItem key={post.id} index={index} post={post} />;
      }}
      components={{
        Footer: () => {
          if (!hasMorePages) {
            return <div />;
          }

          return <PostSkeleton />;
        },
      }}
    />
  );
}
