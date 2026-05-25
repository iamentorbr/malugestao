import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uqabmupcsyvsdkfinrbe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYWJtdXBjc3l2c2RrZmlucmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDY4NDYsImV4cCI6MjA5NTI4Mjg0Nn0.OXvIT5aXTWfkJhg3V_Cht2tfaDJxHfAx1COw_CPO-r4"
);
