import { type LoaderFunctionArgs } from '@remix-run/node';
import { json, Outlet, redirect, ShouldRevalidateFunctionArgs, useLoaderData, useNavigation } from '@remix-run/react';
import { InfiniteVirtualList } from '~/components/infinite-virtual-list';
import { PostSearch } from '~/components/post-search';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { WritePost } from '~/components/write-post';
import { getAllPostsWithDetails } from '~/lib/database.server';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';
import { combinePostsWithLikes, getUserDataFromSession } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession, supabase } = await getSupabaseWithSessionHeaders({ request });

  if (!serverSession) {
    return redirect('/login', { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get('query');
  const page = Number(searchParams.get('page')) || 1;

  const { data, totalPages } = await getAllPostsWithDetails({ dbClient: supabase, page: isNaN(page) ? 1 : page, searchQuery: query });

  const {
    userId: serverUserId,
    // userName,
    // userAvatarUrl,
  } = getUserDataFromSession(serverSession);

  const posts = combinePostsWithLikes(data, serverUserId);

  return json({ query, posts, userDetail: { serverUserId }, totalPages }, { headers });
};

export function shouldRevalidate({ actionResult, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  const skipRevalidation = actionResult?.skipRevalidation && actionResult?.skipRevalidation?.includes('catposts');

  if (skipRevalidation) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function Catposts() {
  const navigation = useNavigation();
  const {
    query,
    posts,
    userDetail: { serverUserId },
    totalPages,
  } = useLoaderData<typeof loader>();

  // means that I am typing something in my search field and my page is reloading
  const isSearching = Boolean(navigation?.location && new URLSearchParams(navigation.location.search).has('query'));

  return (
    <div className='w-full max-w-xl px-4 flex flex-col'>
      <Outlet />
      <Tabs defaultValue='view-posts' className='my-2'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='view-posts'>View Posts</TabsTrigger>
          <TabsTrigger value='write-post'>Write Posts</TabsTrigger>
        </TabsList>

        <TabsContent value='view-posts'>
          <Separator />
          <PostSearch searchQuery={query} isSearching={isSearching} />
          <InfiniteVirtualList incomingPosts={posts} totalPages={totalPages} />
        </TabsContent>
        <TabsContent value='write-post'>
          <WritePost sessionUserId={serverUserId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
