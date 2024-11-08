import { Icon } from '@iconify/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { useToast } from '~/components/hooks/use-toast';
import { deleteLike, insertLike } from '~/lib/database.server';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';
import { cn } from '~/lib/utils';

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers, serverSession } = await getSupabaseWithSessionHeaders({ request });

  if (!serverSession) {
    return redirect('/login', { headers });
  }

  const formData = await request.formData();
  const action = formData.get('action');
  const postId = formData.get('postId')?.toString();
  const userId = formData.get('userId')?.toString();

  const skipRevalidation = ['catposts', 'profile.$username'];

  if (!userId || !postId) {
    return json({ error: 'User or Tweet ID missing' }, { status: 400, headers });
  }

  if (action === 'like') {
    const { error } = await insertLike({
      dbClient: supabase,
      userId,
      postId,
    });

    if (error) {
      return json({ error: 'Failed to like', skipRevalidation }, { status: 500, headers });
    }
  } else {
    const { error } = await deleteLike({
      dbClient: supabase,
      userId,
      postId,
    });

    if (error) {
      return json({ error: 'Failed to unlike', skipRevalidation }, { status: 500, headers });
    }
  }

  return json({ ok: true, error: null, skipRevalidation }, { headers });
}

type LikeProps = {
  likedByUser: boolean;
  likes: number;
  postId: string;
  sessionUserId: string;
};

export function Like({ likedByUser, likes, postId, sessionUserId }: LikeProps) {
  const fetcher = useFetcher<typeof action>();
  const inFlightAction = fetcher.formData?.get('action');
  const isLoading = fetcher.state !== 'idle';
  const { toast } = useToast();

  const optimisticLikedByUser = inFlightAction ? inFlightAction === 'like' : likedByUser;
  const optimisticLikes = inFlightAction ? (inFlightAction === 'like' ? likes + 1 : likes - 1) : likes;

  useEffect(() => {
    if (fetcher.data?.error && !isLoading) {
      const error = fetcher.data?.error;
      console.error('Error occured in like', { error, isLoading });

      toast({
        variant: 'destructive',
        description: `Error occured: ${error}`,
      });
    }
  }, [fetcher.data, isLoading, toast]);

  return (
    <fetcher.Form action='/resources/like' method='post'>
      <input type='hidden' name='postId' value={postId} />
      <input type='hidden' name='userId' value={sessionUserId} />
      <input type='hidden' name='action' value={optimisticLikedByUser ? 'unlike' : 'like'} />
      <button className='group flex items-center focus:outline-none' disabled={isLoading}>
        <Icon icon='solar:star-line-duotone' className={cn('size-4  group-hover:text-indigo-400', optimisticLikedByUser ? 'text-indigo-700' : 'text-muted-foreground')} />
        <span className={cn('ml-1 text-sm group-hover:text-indigo-400', optimisticLikedByUser ? 'text-indigo-700' : 'text-muted-foreground')}>{optimisticLikes}</span>
      </button>
    </fetcher.Form>
  );
}
