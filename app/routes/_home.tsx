import { json, Link, Outlet, redirect, useLoaderData, useOutletContext } from '@remix-run/react';
import { useState } from 'react';
import {  AppLogo } from '~/components/app-logo';
import { Icon } from '@iconify/react';
import { cn, getUserDataFromSession } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import type { SupabaseOutletContext } from '~/lib/supabase';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionHeaders({ request });

  if (!serverSession) {
    return redirect('/login', { headers });
  }

  const { userId, userName, userAvatarUrl } = getUserDataFromSession(serverSession);

  return json({ useDetail: { userId, userName, userAvatarUrl } }, { headers });
};

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const { useDetail } = useLoaderData<typeof loader>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <section className='w-full bg-white min-h-screen flex flex-col items-center'>
      <nav className='sticky top-0 z-50 flex w-full items-center justify-between p-4 border-b border-zinc-200 flex-wrap md:flex-nowrap bg-inherit'>
        <Link to={'/'} className='flex items-center space-x-2'>
          <AppLogo className='size-8 md:size-10' />
          <h1 className='text-xl font-semibold text-zinc-900'>Catposter</h1>
        </Link>

        <button className='md:hidden' onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <Icon icon='si:close-fill' /> : <Icon icon='ci:hamburger-md' />}
        </button>

        <div className={cn('flex items-center space-x-2 gap-1', isNavOpen ? 'flex-col order-last w-full md:w-auto' : 'hidden md:flex')}>
          <Link to={`/profile/${useDetail.userName || null}`}>@{useDetail?.userName}</Link>

          <img
            className='rounded-full'
            height={40}
            width={40}
            alt='Profile'
            style={{
              aspectRatio: '40/40',
              objectFit: 'cover',
            }}
            src={useDetail?.userAvatarUrl}
          />

          <Button variant='secondary' onClick={() => handleSignOut()}>
            Logout
          </Button>
        </div>
      </nav>

      <Outlet />
    </section>
  );
}
