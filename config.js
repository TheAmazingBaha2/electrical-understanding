// Official V2 uses the existing learning database; no data migration or rekeying.
export const SUPABASE_URL = 'https://hkwmtjhgrskidaizamwy.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_2lV_l7v4q14RY-UITnYlUg_SFdewEYZ';
export const SUPABASE_ENVIRONMENT = 'production';
export function syncAllowed(location){
 return location.protocol==='https:' && (location.hostname==='electrical-understanding.vanguardcorbett.workers.dev' || location.hostname==='theamazingbaha2.github.io' && /^\/electrical-understanding(?:\/|$)/.test(location.pathname));
}
