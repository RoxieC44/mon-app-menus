import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'TON_URL_SUPABASE'; // Ex: https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'TA_CLE_ANON_SUPABASE'; // Ta longue clé publique

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
