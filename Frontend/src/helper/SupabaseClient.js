import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://cwgagzifrmurekktwypw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Z2Fnemlmcm11cmVra3R3eXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTEwMTUsImV4cCI6MjA1Nzg2NzAxNX0.RWSsgtfpKT7Ewz2OXgaoZfTnPfBhTSX9FYxptk9gqNA'

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;