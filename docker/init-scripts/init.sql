drop schema if exists mies;
create schema mies;

create table mies.user (
  id serial primary key,
  name text not null,
  email text unique not null,
  created_at timestamp default current_timestamp,
  update_at timestamp
);
