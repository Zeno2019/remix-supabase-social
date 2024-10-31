import { createServerClient, parse, parseCookieHeader, serialize, serializeCookieHeader } from '@supabase/ssr';
import { Database } from 'database.types';

export const getSupabaseEnv = () => ({
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
});

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const cookies = parseCookieHeader(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  // new version
  const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookies;
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => headers.append('Set-Cookie', serializeCookieHeader(name, value, options)));
      },
    },

    // auth: {
    //   detectSessionInUrl: true,
    //   flowType: 'pkce',
    // },
  });

  return { supabase, headers };
}

export async function getSupabaseWithSessionHeaders({ request }: { request: Request }) {
  const { supabase, headers } = getSupabaseWithHeaders({ request });
  const {
    data: { session: serverSession },
  } = await supabase.auth.getSession();

  return { supabase, headers, serverSession };
}
