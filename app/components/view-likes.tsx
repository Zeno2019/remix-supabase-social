import { Link } from '@remix-run/react';
import { Icon } from '@iconify/react';
import { cn } from '~/lib/utils';

type ViewLikesProps = {
  likes: number;
  likeByUser: boolean;
  pathname: string;
  readonly?: boolean;
};

export function ViewLikes({ likes, likeByUser, pathname, readonly }: ViewLikesProps) {
  return (
    <Link to={pathname} preventScrollReset={true} className='flex justify-center items-center group'>
      {likeByUser ? (
        <Icon icon='solar:star-line-duotone' className='size-4 text-indigo-700 group-hover:text-indigo-400' />
      ) : (
        <Icon icon='solar:star-line-duotone' className='size-4 text-muted-foreground group-hover:text-indigo-400' />
      )}
      <span className={cn('ml-1 text-sm group-hover:text-indigo-400', likeByUser ? 'text-indigo-700' : 'text-muted-foreground')}>{likes}</span>
    </Link>
  );
}
