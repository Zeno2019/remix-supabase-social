import { Icon } from '@iconify/react';
import { Link } from '@remix-run/react';

type ViewCommentsProps = {
  comments: number;
  pathname: string;
  readonly?: boolean;
};

export function ViewComments({ comments, pathname, readonly }: ViewCommentsProps) {
  return (
    <>
      {readonly ? (
        <div className='flex justify-center items-center group'>
          <Icon icon='hugeicons:message-01' className='size-4 text-muted-foreground' />
          <span className='ml-1 text-sm text-muted-foreground'>{comments}</span>
        </div>
      ) : (
        <Link to={pathname} preventScrollReset={true} className='flex justify-center items-center group'>
          <Icon icon='hugeicons:message-01' className='size-4 text-muted-foreground group-hover:text-indigo-400' />
          <span className='ml-1 text-sm text-muted-foreground group-hover:text-indigo-400'>{comments}</span>
        </Link>
      )}
    </>
  );
}
