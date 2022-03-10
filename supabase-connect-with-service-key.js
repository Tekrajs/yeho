const { createClient } = require('@supabase/supabase-js');

exports.initSupabase = () => {
    return supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SERVICE_KEY,
    );
}