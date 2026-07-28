import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = (envUrl && envUrl.startsWith('http')) ? envUrl : 'https://ncfmtzglyxrvdyqcpbvb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZm10emdseXhydmR5cWNwYnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzkzODIsImV4cCI6MjEwMDc1NTM4Mn0.p-cME1FOf511LFXeTi8yEHT5j3uhiDvb3bl7R6gh7mU';

export const supabase = createClient(supabaseUrl, supabaseKey);
