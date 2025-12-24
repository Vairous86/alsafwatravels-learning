import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efzhjgorhdenmipriqip.supabase.co';
const supabaseKey = 'sb_publishable_Zgnc2VBYp11MMrv7EI_4LQ_p_glZ1z-';

export const supabase = createClient(supabaseUrl, supabaseKey);