drop schema if exists mies;
create schema mies;

create table mies.user (
  id serial primary key,
  name text not null,
  email text unique not null,
  created_at timestamp default current_timestamp,
  update_at timestamp
);

create table mies.params (
  scope text check (scope in ('global', 'user')) not null,
  scope_id text unique not null,
  data jsonb not null,
  update_at timestamp default current_timestamp,

  primary key (scope, scope_id)
);