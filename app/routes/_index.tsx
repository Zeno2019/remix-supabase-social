import { LoaderFunctionArgs } from '@remix-run/node';
import { json, Link, redirect } from '@remix-run/react';
import {  AppLogo } from '~/components/app-logo';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { getSupabaseWithSessionHeaders } from '~/lib/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionHeaders({ request });

  if (serverSession) {
    return redirect('/catposts', { headers });
  }

  return json({ success: true }, { headers });
};

export default function Index() {
  return (
    <section className='w-full bg-white min-h-screen flex flex-col'>
      <nav className='flex items-center space-x-2 p-4'>
        <AppLogo className='size-8 md:size-10' />
        <h1 className='text-xl font-semibold text-zinc-900'>Catposter</h1>
      </nav>
      <div className='container md:flex justify-center items-center px-4 md:px-6 flex-1'>
        <div className='flex flex-col items-center space-y-4 text-center p-4 md:w-1/2'>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tighter'>
            A{' '}
            <span
              className='font-extrabold bg-gradient-to-r from-orange-700 via-indigo-500 to-green-400 text-transparent bg-clip-text bg-300% 
            animate-gradient
            '>
              Community-Driven
            </span>{' '}
            Minimalist Social Platform for Coders & Cats
          </h1>

          <p className='text-gray-500 mt-2'>
            Powered by <span className='text-indigo-700 font-bold mt-2'>Remix</span> and <span className='text-green-700 font-bold mt-2'>Supabase</span>
          </p>

          <Button asChild>
            <Link to={'/login'}>Join our Community</Link>
          </Button>
        </div>
        <Card className='relative group overflow-hidden rounded-lg md:w-1/2'>
          <CardContent className='p-1'>
            <video className='size-full rounded-lg' autoPlay loop muted>
              <source src='assets/videos/catposter-demo.mp4' type='video/mp4'></source>
            </video>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
