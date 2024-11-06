import type { Session } from '@supabase/supabase-js';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PostWithCommentDetails, PostWithDetails } from './types';

import { format, parseISO } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function _setTimeout(callback: () => void, delay: number): () => void {
//   const expectedTime = Date.now() + delay
//   let rafId: number | null = null

//   const tick = () => {
//     const remaining = expectedTime - Date.now()

//     if (remaining <= 0) {
//       callback()
//     }
//     else {
//       rafId = requestAnimationFrame(tick)
//     }
//   }

//   rafId = requestAnimationFrame(tick)

//   // 返回取消函数
//   return () => {
//     if (rafId !== null) {
//       cancelAnimationFrame(rafId)
//     }
//   }
// }

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function _debounceFunc(this: any, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  }

  _debounceFunc.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return _debounceFunc;
}

export function getUserDataFromSession(session: Session) {
  const userId = session.user.id;
  const userAvatarUrl = session.user.user_metadata.avatar_url;
  const userName = session.user.user_metadata.user_name;

  return { userId, userAvatarUrl, userName };
}

export function combinePostsWithLikes(data: PostWithDetails[] | null, sessionUserId: string) {
  const posts =
    data?.map((post) => {
      return {
        ...post,
        isLikedByUser: Boolean(post.likes.find((like) => like.user_id === sessionUserId)),
        likes: post.likes,
        comments: post.comments,
        author: post.author!,
      };
    }) ?? [];

  return posts;
}

export function combinePostsWithLikesAndComments(data: PostWithCommentDetails[] | null, sessionUserId: string) {
  const posts = data?.map((post) => {
    const commentsWithAvatarUrl = post.comments.map((comment) => ({
      ...comment,
      author: {
        avatar_url: comment.author?.avatar_url,
        username: comment.author?.username,
      },
    }));

    return {
      ...post,
      isLikedByUser: Boolean(post.likes.find((like) => like.user_id === sessionUserId)),
      likes: post.likes,
      comments: commentsWithAvatarUrl,
      author: post.author!,
    };
  }) ?? [];

  return posts;
}

export function formatToTwitterDate(dateTimeString: string, locale: string = 'en'): string {
  const date = parseISO(dateTimeString);

  if (locale.toLowerCase().startsWith('zh')) {
    return format(date, "a h:mm · yyyy'年'MM'月'd'日'", {
      locale: zhCN,
    });
  }

  // such as：3:30 PM · Dec 25, 2023
  return format(date, 'h:mm a · MMM d, yyyy', {
    locale: enUS,
  });
}
