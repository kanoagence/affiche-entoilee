import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Client public — lectures côté client/public
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin — lectures + écritures depuis le back-office (service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
