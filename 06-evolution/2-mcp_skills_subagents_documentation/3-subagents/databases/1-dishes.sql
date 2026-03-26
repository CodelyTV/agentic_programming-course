CREATE SCHEMA IF NOT EXISTS dishes;

CREATE TABLE dishes.cooked_dishes (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients JSONB NOT NULL,
    embedding vector(1024) NOT NULL,
    cooked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
