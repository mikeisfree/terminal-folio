import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define database types
export interface User {
  id: string  // Changed from number to string for UUID
  username: string
  access_level: number
  created_at: string
}

export interface InputLog {
  id: string  // Changed from number to string for UUID
  user_id: string  // Changed from number to string for UUID
  access_level: number
  command_text: string
  timestamp: string
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    const { data, error } = await supabase.rpc('create_terminal_users_table');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Create the stored procedure in Supabase SQL Editor:
/*
create or replace function init_terminal_database()
returns void as $$
begin
  -- Create users table if it doesn't exist
  create table if not exists users (
    id serial primary key,
    username text unique not null,
    access_level integer default 1,
    created_at timestamp with time zone default now()
  );
  
  -- Create input_log table if it doesn't exist
  create table if not exists input_log (
    id serial primary key,
    user_id integer references users(id),
    access_level integer,
    command_text text,
    timestamp timestamp with time zone default now()
  );
end;
$$ language plpgsql;
*/

