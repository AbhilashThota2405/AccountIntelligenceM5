import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '<SUPABASE_URL>';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '<SUPABASE_SERVICE_ROLE_KEY>';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  console.log("Connecting to Supabase...");
  
  const tables = ['accounts', 'contacts', 'deals', 'activities', 'notes', 'todos', 'briefs', 'boards'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error(`Error querying table '${table}':`, error.message);
      } else {
        console.log(`Table '${table}' exists. Row count: ${count}`);
      }
    } catch (e) {
      console.error(`Exception querying table '${table}':`, e.message);
    }
  }

  // Let's also fetch a few accounts if any exist
  try {
    const { data, error } = await supabase.from('accounts').select('*').limit(3);
    if (error) {
      console.error("Error fetching accounts data:", error.message);
    } else {
      console.log("Sample accounts data:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Exception fetching accounts:", e.message);
  }
}

inspect();
