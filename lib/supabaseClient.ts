import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  return cleaned.startsWith('http://') || cleaned.startsWith('https://');
};

const getValidApiUrl = (envUrl?: string, fallbackUrl: string = 'https://kwsohmrxwqetmekohalj.supabase.co'): string => {
  if (isValidHttpUrl(envUrl)) {
    return envUrl!.trim().replace(/^["']|["']$/g, '');
  }
  return fallbackUrl;
};

const SUPABASE_URL = getValidApiUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://kwsohmrxwqetmekohalj.supabase.co'
);

const SUPABASE_ANON_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3c29obXJ4d3FldG1la29oYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MjY4ODksImV4cCI6MjEwOTEwMjg4OX0.rks-2Hkz_ODpyPg--a7GY3TvL4Jdb5kt4zHECqV2YqI'
).trim().replace(/^["']|["']$/g, '');

// Browser-persistent singleton instance
let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return clientInstance;
};

export const supabase = getSupabase();
