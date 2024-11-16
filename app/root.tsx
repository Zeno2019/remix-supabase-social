import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import './tailwind.css';
import { getSupabaseEnv, getSupabaseWithSessionHeaders } from './lib/supabase.server';
import { useSupabase } from './lib/supabase';
import { Toaster } from './components/ui/toaster';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { serverSession, headers } = await getSupabaseWithSessionHeaders({ request });

  const domainUrl = process.env.DOMAIN_URL;
  const env = getSupabaseEnv();

  return json(
    { serverSession, env, domainUrl },
    {
      headers,
    }
  );
};

export const meta: MetaFunction = () => {
  return [
    { title: "Cat Poster" },
    { name: "description", content: "Welcome to Cat Poster!" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='overscroll-none'>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  const { env, serverSession, domainUrl } = useLoaderData<typeof loader>();

  const { supabase } = useSupabase({ env, serverSession });

  return <Outlet context={{ supabase, domainUrl }} />;
}
