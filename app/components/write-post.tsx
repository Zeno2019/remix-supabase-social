import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Icon } from '@iconify/react';

type WritePostProps = {
  sessionUserId: string;
  postId?: string;
  isComment?: boolean;
};

export function WritePost({ sessionUserId, postId, isComment }: WritePostProps) {
  const fetcher = useFetcher();
  const [title, setTitle] = useState('');
  const isPosting = fetcher?.state !== 'idle';
  const isDisabled = isPosting || !title;
  const postActionUrl = '/resources/post';

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const postTitle = () => {
    console.info('Posting to server');
    const formData = {
      title,
      userId: sessionUserId,
    };

    fetcher.submit(formData, { method: 'post', action: postActionUrl });
    setTitle('');
  };

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'inherit';
      const computed = window.getComputedStyle(textareaRef.current);
      const height = textareaRef.current.scrollHeight + parseInt(computed.getPropertyValue('border-top-width')) + parseInt(computed.getPropertyValue('border-bottom-width'));

      textareaRef.current.style.height = `${height}px`;
    }
  }, [title]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Post</CardTitle>
        <CardDescription>You can write your post in MD</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea ref={textareaRef} placeholder='Type your Catpost here !!!' value={title} onChange={(e) => setTitle(e.target.value)} className='mb-2' />
      </CardContent>
      <CardFooter>
        <Button onClick={postTitle} disabled={isDisabled}>
          {isPosting && <Icon icon='radix-icons:update' className='mr-2 h-4 w-4 animate-spin' />}
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
}
