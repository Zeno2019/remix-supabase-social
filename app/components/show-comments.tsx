import { Link } from '@remix-run/react';
import { Avatar, AvatarImage } from './ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type CommentProps = {
  avatarUrl?: string;
  title?: string;
  username?: string;
};

export function ShowComments({ avatarUrl, username, title }: CommentProps) {
  return (
    <div className='flex flex-col items-start'>
      <div className='flex items-center'>
        <Avatar className='size-8'>
          <AvatarImage src={avatarUrl} />
        </Avatar>
        <div className='ml-2'>
          <Link to={`/profile/${username}`}>
            <div className='text-sm font-semibold'>{username}</div>
          </Link>
        </div>
      </div>
      <div className='text-sm prose py-4'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{title}</ReactMarkdown>
      </div>
    </div>
  );
}
