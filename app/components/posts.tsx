import { Link } from '@remix-run/react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import {  AppLogo } from '~/components/app-logo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type PostProps = {
  avatarUrl: string;
  name: string;
  id: string;
  username: string;
  title: string;
  dateTimeString: string;
  userId: string;
  children?: React.ReactNode;
};

export function PostSkeleton() {
  return (
    <Card className='flex space-x-4 min-h-[12rem] my-3 p-8'>
      <Skeleton className='size-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[15rem]' />
        <Skeleton className='h-4 w-[13rem]' />
      </div>
    </Card>
  );
}

export function Post({ avatarUrl, name, id, username, title, dateTimeString, userId, children }: PostProps) {
  return (
    // Using padding instead of margin on the card
    // https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
    <div className='py-2'>
      <Card key={id} className='rounded-xl shadow-md overflow-hidden min-h-[12rem]'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <span className='object-cover md:w-48 rounded-md bg-muted' />
          </div>

          <div className='p-4 md:p-8 w-full'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Avatar className='size-12'>
                  <AvatarImage className='rounded-full' alt='User avatar' src={avatarUrl} />
                </Avatar>

                <div className='ml-4'>
                  <div className='text-sm md:text-lg font-semibold'>
                    <Link prefetch='intent' to={`/profile/${username}`}>
                      {name}
                    </Link>
                  </div>

                  <div className='text-muted-foreground text-sm md:text-md'>
                    <Link prefetch='intent' to={`/profile/${username}`}>
                      @{username}
                    </Link>
                  </div>
                </div>
              </div>

              <AppLogo className='size-8 md:size-10' />
            </div>

            <div className='mt-4 text-sm prose dark:prose-invert prose-pre:border'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{title}</ReactMarkdown>
            </div>

            <div className='flex mt-6 justify-between items-center'>
              <div className='flex space-x-4'>{children}</div>
              <div className='text-muted-foreground text-sm'>{dateTimeString}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
