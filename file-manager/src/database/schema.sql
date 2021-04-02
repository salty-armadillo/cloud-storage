CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255),
    email VARCHAR(255),
    password_hash BINARY(60),
    PRIMARY KEY (username)
);