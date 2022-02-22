const { databaseConfig } = require('./config');
const { createClient } = require('@supabase/supabase-js');

const options = {
    schema: 'public',
    persistSession: true,
}

exports.initSupabase = () => {
    return supabase = createClient(
        databaseConfig.SUPABASE_URL,
        databaseConfig.SUPABASE_PUBLIC_KEY,
        options
    );
}