import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Admin client with service role (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Public client with anon key (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test database connection
export const testConnection = async () => {
    try {
        const { error } = await supabaseAdmin
            .from('users')
            .select('count')
            .limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
            throw error;
        }

        return true;
    } catch (error) {
        return false;
    }
};

export default supabaseAdmin;
