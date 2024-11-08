import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getPostWithDetailsById } from '~/lib/database.server';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';
import { combinePostsWithLikesAndComments, formatToTwitterDate, getUserDataFromSession } from '~/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Post } from '~/components/posts';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Like } from './resources.like';
import { ViewComments } from '~/components/view-comments';
import { WritePost } from '~/components/write-post';
import { Card } from '~/components/ui/card';
import { ShowComments } from '~/components/show-comments';
import { AppLogo } from '~/components/app-logo';
import { useEffect, useState } from 'react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { postId } = params;

  const { supabase, headers, serverSession } = await getSupabaseWithSessionHeaders({ request });

  if (!serverSession) {
    return redirect('/login', { headers });
  }

  if (!postId) {
    return redirect('/404', { headers });
  }

  const { userId: sessionUserId } = getUserDataFromSession(serverSession);

  const { data } = await getPostWithDetailsById({ dbClient: supabase, postId });

  const post = combinePostsWithLikesAndComments(data, sessionUserId);

  return json(
    {
      post: post[0],
      sessionUserId,
    },
    {
      headers,
    }
  );
};

export default function CurrentPost() {
  const { post, sessionUserId } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      navigate(-1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(status) => setOpen(status)}>
      <DialogContent className='max-w-xl h-[90vh] overflow-y-auto'>
        <DialogHeader className='hidden'>
          <DialogTitle className=''>Post Details</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className='my-2 text-left flex flex-col justify-between h-full'>
          <div>
            <Post
              avatarUrl={post.author?.avatar_url}
              name={post.author?.username}
              username={post.author?.username}
              title={post.title}
              userId={sessionUserId}
              id={post.id}
              dateTimeString={formatToTwitterDate(post.created_at, 'en')}>
              <Like likes={post.likes?.length} likedByUser={post.isLikedByUser} sessionUserId={sessionUserId} postId={post.id} />
              <ViewComments comments={post.comments?.length} pathname={'/'} readonly={true} />
            </Post>

            {post.comments.length > 0 ? (
              <div>
                {post.comments?.map(({ title, author }, index) => {
                  return (
                    <Card key={index} className='p-4 my-2 min-h-24'>
                      <ShowComments title={title} avatarUrl={author?.avatar_url} username={author?.username} />
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className='flex justify-center items-center min-h-[8vh] max-h-[30vh] '>
                <AppLogo className='size-10 opacity-10' />
                <h2 className='ml-2'>No comments yet !!</h2>
              </div>
            )}
          </div>

          <WritePost sessionUserId={sessionUserId} postId={post.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
