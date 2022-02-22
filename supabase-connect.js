const { createClient } = require('@supabase/supabase-js');

const options = {
    schema: 'public',
    persistSession: true,
}

exports.initSupabase = () => {
    return supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PUBLIC_KEY,
        options
    );
}