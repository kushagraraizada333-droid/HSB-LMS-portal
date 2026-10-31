import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = rawUrl ? rawUrl.replace(/\/+$/, '') : '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder-project') &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('placeholder')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (clientInstance) return clientInstance;

  if (isSupabaseConfigured()) {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return clientInstance;
  }

  // Safe fallback dummy client to prevent unhandled runtime errors while credentials are being configured
  clientInstance = createClient(
    'https://placeholder-project.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  return clientInstance;
};

export const supabase = getSupabase();

/**
 * Health check: Tests real connection to Supabase database.
 * Returns { connected: true, message: '...' } when successfully reachable,
 * or { connected: false, message: '...' } with descriptive troubleshooting advice.
 */
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  error?: string;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in .env. Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.',
    };
  }

  try {
    const client = getSupabase();
    // Test query on the public courses or profiles table
    const { data, error } = await client
      .from('courses')
      .select('code, title')
      .limit(1);

    if (error) {
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('schema cache')
      ) {
        return {
          connected: true,
          message: 'Connected to Supabase project! Database tables are not yet created. Please run supabase/schema.sql in your Supabase SQL Editor.',
          error: error.message,
        };
      }
      return {
        connected: false,
        message: `Database connection error: ${error.message} (Code: ${error.code})`,
        error: error.message,
      };
    }

    return {
      connected: true,
      message: `Successfully connected to Supabase database! Found ${data ? data.length : 0} course record(s).`,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase project: ${err?.message || 'Network error'}`,
      error: err?.message,
    };
  }
};
