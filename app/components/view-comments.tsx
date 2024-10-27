import { Icon } from '@iconify/react';
import { Link } from '@remix-run/react';

type ViewCommentsProps = {
  number: number;
  pathname: string;
  readonly?: boolean;
};

export function ViewComments({ number, pathname, readonly }: ViewCommentsProps) {
  return (
    <>
      {readonly ? (
        <div className='flex justify-center items-center group'>
          <Icon icon='hugeicons:message-01' className='size-4 text-muted-foreground' />
          <span className='ml-1 text-sm text-muted-foreground'>{number}</span>
        </div>
      ) : (
        <Link to={pathname} preventScrollReset={true} className='flex justify-center items-center group'>
          <Icon icon='hugeicons:message-01' className='size-4 text-muted-foreground group-hover:text-indigo-400' />
          <span className='ml-1 text-sm text-muted-foreground group-hover:text-indigo-400'>{number}</span>
        </Link>
      )}
    </>
  );
}
