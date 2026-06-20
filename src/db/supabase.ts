import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hkwqsucxjnhijgctvvbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3FzdWN4am5oaWpnY3R2dmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTk2MjYsImV4cCI6MjA5NzQ3NTYyNn0.lVWBLMQ9M9d273ZSTNNmwC4hta0WF6eLbcSGTl58k1Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
