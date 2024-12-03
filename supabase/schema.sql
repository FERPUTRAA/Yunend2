-- Create messages table
create table messages (
  id bigint generated by default as identity primary key,
  content text not null,
  spotify_track_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table messages enable row level security;

-- Create policy to allow anyone to read messages
create policy "Anyone can read messages"
  on messages for select
  using (true);

-- Create policy to allow authenticated users to insert messages
create policy "Authenticated users can insert messages"
  on messages for insert
  with check (auth.role() = 'authenticated');

