import { useRevalidator } from '@remix-run/react';
import { createBrowserClient } from '@supabase/ssr';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database.types';
import { useEffect, useState } from 'react';

export type TypeSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
  supabase: TypeSupabaseClient;
  domainUrl: string;
};

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

type UseSupabase = {
  env: SupabaseEnv;
  serverSession: Session | null;
};

export const useSupabase = ({ env, serverSession }: UseSupabase) => {
  // Singleton
  const [supabase] = useState(() => createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));

  const serverAccessToken = serverSession?.access_token;
  const revalidator = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // call loaders
        revalidator.revalidate();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidator]);

  return { supabase };
};

// export function getRealTimeSubscription(supabase: TypeSupabaseClient, callback: () => void) {
//   return supabase
//     .channel('realtime posts and likes')
//     .on(
//       'postgres_changes',
//       {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'posts',
//       },
//       () => callback()
//     )
//     .subscribe();
// }
