DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS searches;
DROP TABLE IF EXISTS votes;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name varchar(50) NOT NULL,
  last_name varchar(50),
  display_name varchar(100),
  username varchar(50) UNIQUE,
  email varchar(50) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  biographical varchar(255)
);

CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  search_term varchar(255) NOT NULL,
  created_at timestamp NOT NULL default CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) NOT NULL
);

CREATE TABLE votes (
  photo_id SERIAL PRIMARY KEY,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);
