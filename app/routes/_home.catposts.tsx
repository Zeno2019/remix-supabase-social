import { type LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect, useLoaderData, useNavigation } from '@remix-run/react';
import { PostSearch } from '~/components/post-search';
import { Post } from '~/components/posts';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { ViewComments } from '~/components/view-comments';
import { ViewLikes } from '~/components/view-likes';
import { WritePost } from '~/components/write-post';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionHeaders({ request });

  if (!serverSession) {
    return redirect('/login', { headers });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get('query');

  return json({ query }, { headers });
};

export default function Catposts() {
  const navigation = useNavigation();

  // means that I am typing something in my search field and my page is reloading
  const isSearching = Boolean(navigation?.location && new URLSearchParams(navigation.location.search).has('query'));

  const { query } = useLoaderData<typeof loader>();

  const mockUserInfo = {
    id: '321',
    userId: '12345',
    name: 'zeno',
    username: 'zenost',
    title: '## markdown title',
    dateTimeString: '2022-01-01',
    avatarUrl: 'https://avatars.githubusercontent.com/u/29234804?v=4',
  };

  const mockViewLikes = {
    likes: 89,
    pathname: '/profile/zenost',
  };

  return (
    <div className='w-full max-w-xl px-4 flex flex-col'>
      <Tabs defaultValue='view-posts' className='my-2'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='view-posts'>View Posts</TabsTrigger>
          <TabsTrigger value='write-post'>Write Posts</TabsTrigger>
        </TabsList>

        <TabsContent value='view-posts'>
          <Separator />
          <PostSearch searchQuery={query} isSearching={isSearching} />
          <Post
            id={mockUserInfo.id}
            avatarUrl={mockUserInfo.avatarUrl}
            userId={mockUserInfo.userId}
            name={mockUserInfo.name}
            username={mockUserInfo.username}
            title={mockUserInfo.title}
            dateTimeString={mockUserInfo.dateTimeString}>
            <ViewLikes likes={mockViewLikes.likes} likeByUser={false} pathname={mockViewLikes.pathname} />
            <ViewComments number={420} pathname={mockViewLikes.pathname} />
            <div></div>
          </Post>
        </TabsContent>
        <TabsContent value='write-post'>
          <WritePost sessionUserId={mockUserInfo.userId} postId={mockUserInfo.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
