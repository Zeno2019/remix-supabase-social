import { Link, Outlet } from '@remix-run/react';
import { useState } from 'react';
import { OpenmojiPoutingCat as AppLogo } from '~/components/openmoji-pouting-cat';
import { Icon } from '@iconify/react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <section className='w-full bg-white min-h-screen flex flex-col items-center'>
      <nav className='sticky top-0 z-50 flex w-full items-center justify-between p-4 border-b border-zinc-200 flex-wrap md:flex-nowrap'>
        <Link to={'/'} className='flex items-center space-x-2'>
          <AppLogo className='size-8 md:size-10' />
          <h1 className='text-xl font-semibold text-zinc-900'>Catposter</h1>
        </Link>

        <button className='md:hidden' onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <Icon icon='si:close-fill' /> : <Icon icon='ci:hamburger-md' />}
        </button>

        <div className={cn('flex items-center space-x-2', isNavOpen ? 'flex-col order-last w-full md:w-auto' : 'hidden md:flex')}>
          <Link to={`/profile/${null}`}>Anonymous</Link>

          {/* <img
            className='rounded-full'
            height={40}
            width={40}
            alt='Profile'
            style={{
              aspectRatio: '40/40',
              objectFit: 'cover',
            }}
            src=''
          /> */}
          <Icon icon='mdi:anonymous-circle' className='rounded-full size-[2.5rem] object-cover aspect-square' />
          <Button variant='secondary'>Logout</Button>
        </div>
      </nav>

      <Outlet />
    </section>
  );
}
