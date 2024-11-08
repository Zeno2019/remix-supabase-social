import { useFetcher, useLocation, useRouteLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { CombinedPostsWithAuthorAndLikes } from '~/lib/types';
import type { loader as postsLoader } from '~/routes/_home.catposts';
import type { loader as postLoader } from '~/routes/_home.catposts.$postId';

type UseInfinitePosts = {
  incomingPosts: CombinedPostsWithAuthorAndLikes;
  totalPages: number;
  postRouteId: string;
};

export const useInfinitePosts = ({ incomingPosts, totalPages, postRouteId }: UseInfinitePosts) => {
  const [posts, setPosts] = useState<CombinedPostsWithAuthorAndLikes>(incomingPosts);
  const fetcher = useFetcher<typeof postsLoader>();
  const data = useRouteLoaderData<typeof postLoader>(postRouteId);

  const [currentPage, setCurrentPage] = useState(1);

  const [prevPosts, setPrevPosts] = useState(incomingPosts);
  if (incomingPosts !== prevPosts) {
    setPrevPosts(incomingPosts);
    setPosts(incomingPosts);
    setCurrentPage(1);
  }

  const location = useLocation();

  useEffect(() => {
    const updatePost = data?.post;
    if (!updatePost) return;

    setPosts((posts) => posts.map((post) => (post.id === updatePost.id ? { ...updatePost } : post)));
  }, [data]);


  useEffect(() => {
    if (fetcher.data?.posts) {
      try {
        setPosts((prevPosts) => [...prevPosts, ...(fetcher.data?.posts || [])]);
        setCurrentPage((currentPage) => currentPage + 1);
      } catch (error) {
        console.error('error updating posts: ', { error });
      }
    }
  }, [fetcher.data]);

  const hasMorePages = currentPage < totalPages;

  const loadMore = () => {
    if (hasMorePages && fetcher.state === 'idle') {
      let fullSearchQueryParams = '';

      if (location.search) {
        fullSearchQueryParams = `${location.search}&page=${currentPage + 1}`;
      } else {
        fullSearchQueryParams = `?page=${currentPage + 1}`;
      }

      fetcher.load(`${location.pathname}/${fullSearchQueryParams}`);
    }
  };

  return { posts, loadMore, hasMorePages };
};
