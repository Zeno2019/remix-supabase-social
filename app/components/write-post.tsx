import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Icon } from '@iconify/react';
import { useToast } from '~/components/hooks/use-toast';

type WritePostProps = {
  sessionUserId: string;
  postId?: string;
};

export function WritePost({ sessionUserId, postId }: WritePostProps) {
  const fetcher = useFetcher();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const isPosting = fetcher?.state !== 'idle';
  const isDisabled = isPosting || !title;
  const isComment = Boolean(postId);

  const postActionUrl = isComment ? '/resources/comment' : '/resources/post';

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const postTitle = () => {
    const formData = {
      title,
      userId: sessionUserId,
      ...(isComment ? { postId } : {}),
    };

    fetcher.submit(formData, { method: 'POST', action: postActionUrl });
    setTitle('');
  };

  // action done toast
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      toast({
        title: 'Posting done',
        description: 'Your post has been posted',
      });
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'inherit';
      const computed = window.getComputedStyle(textareaRef.current);
      const height = textareaRef.current.scrollHeight + parseInt(computed.getPropertyValue('border-top-width')) + parseInt(computed.getPropertyValue('border-bottom-width'));

      textareaRef.current.style.height = `${height}px`;
    }
  }, [title]);

  if (isComment) {
    return (
      <Card className='mb-4'>
        <CardContent className='p-4 text-right'>
          <Textarea ref={textareaRef} placeholder='Type your comment here !!!' value={title} onChange={(e) => setTitle(e.target.value)} className='mb-2' />
          <Button onClick={postTitle} disabled={isDisabled}>
            {isPosting && <Icon icon='radix-icons:update' className='mr-2 h-4 w-4 animate-spin' />}
            {isPosting ? 'Commenting...' : 'Comment'}
          </Button>
        </CardContent>
      </Card>
    );
  }

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
