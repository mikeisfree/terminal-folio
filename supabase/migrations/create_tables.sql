-- Create the users table
create table public.users (
    id uuid default gen_random_uuid() primary key,
    username text unique not null,
    access_level integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the function to initialize the database
create or replace function public.create_terminal_users_table()
returns void
language plpgsql
security definer
as $$
begin
    -- Add default user if not exists
    insert into public.users (username, access_level)
    values ('terminal_user', 1)
    on conflict (username) do nothing;
end;
$$;

-- Set up row level security
alter table public.users enable row level security;

-- Create policies
create policy "Users are viewable by everyone"
    on public.users for select
    using (true);

-- Update policies for users to allow public access
DROP POLICY IF EXISTS "Users can be created by authenticated users" ON public.users;
CREATE POLICY "Users can be inserted by anyone"
    ON public.users FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Users can be updated by anyone"
    ON public.users FOR UPDATE
    TO public
    USING (true);

-- Create input_log table
create table public.input_log (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id),
    access_level integer not null,
    command_text text not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security for input_log
alter table public.input_log enable row level security;

-- Create policies for input_log
create policy "Input logs are viewable by everyone"
    on public.input_log for select
    using (true);

-- Update policies for input_log to allow inserts from anyone
DROP POLICY IF EXISTS "Input logs can be created by authenticated users" ON public.input_log;
CREATE POLICY "Input logs can be inserted by anyone"
    ON public.input_log FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Input logs can be updated by anyone"
    ON public.input_log FOR UPDATE
    TO public
    USING (true);
