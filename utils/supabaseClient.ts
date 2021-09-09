import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://digithgdhukwunpiejxj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDk5ODU5OCwiZXhwIjoxOTQ2NTc0NTk4fQ.rQeTcVZItSpBwvnTxLgYsd_Odp_hG62_45XJXsdaZlY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)