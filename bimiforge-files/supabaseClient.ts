import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bimiforge.orengen.io';
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NzEzMjk2MCwiZXhwIjo0OTIyODA2NTYwLCJyb2xlIjoiYW5vbiJ9.a5BAKuz7bunKbLmSwCDgj8a9HyNIfcWHYegsU7spCJc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
