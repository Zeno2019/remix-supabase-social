import { Link } from '@remix-run/react';
import { OpenmojiPoutingCat as AppLogo } from '~/components/openmoji-pouting-cat';
import { Button } from '~/components/ui/button';
import { Icon } from '@iconify/react';

export default function Login() {
  return (
    <section className='w-full bg-white min-h-screen flex flex-col'>
      <nav className='flex items-center p-4'>
        <Link to={'/'} className='flex items-center space-x-2'>
          <AppLogo className='size-8 md:size-10' />
          <h1 className='text-xl font-semibold text-zinc-900'>Catposter</h1>
        </Link>
      </nav>

      <div className='container flex flex-col justify-start items-center px-4 md:px-6 flex-1 mt-24'>
        <div className='flex flex-col items-center space-y-4 text-center p-4'>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tighter'>
            Login in using <br />
            <span
              className='font-extrabold bg-gradient-to-r from-orange-700 via-indigo-500 to-green-400 text-transparent bg-clip-text bg-300% 
            animate-gradient
            '>
              Github
            </span>{' '}
            <br />
            and dicover more
          </h1>

          <p className='text-gray-500 mt-2'>Our posts and comments are powered by Markdown</p>
        </div>
        <Button className='bg-gradient-to-r from-orange-700 via-indigo-500 to-green-400 bg-300% animate-gradient' onClick={() => console.info('Login with Github')}>
          {/* <Icon icon='logos:github-icon' /> */}
          <Icon icon='uim:github-alt' className='size-4' />
          Github
        </Button>
      </div>
    </section>
  );
}
