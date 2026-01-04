import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create a singleton instance to avoid multiple clients
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
