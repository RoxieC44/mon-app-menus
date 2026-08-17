import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zlmnzbavrbslogdtewwt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pNB0R83QxSu3g7-BwWOXXw_Y9X8Xaqg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
