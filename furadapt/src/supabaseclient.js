import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbxxcnxledusfqmyscoh.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpieHhjbnhsZWR1c2ZxbXlzY29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NzYyMzcsImV4cCI6MjA2MzE1MjIzN30.tfnqF8I6knZ6ExwcKMgRQ-CtGYar3m5WhxBAgz9_IOw'; // Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey);