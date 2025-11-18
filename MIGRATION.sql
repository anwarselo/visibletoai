-- Migration: Rename majed_* tables to visibletoai_*
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Drop old tables (in correct order to respect foreign keys)
DROP TABLE IF EXISTS majed_index_events CASCADE;
DROP TABLE IF EXISTS majed_public_pages CASCADE;
DROP TABLE IF EXISTS majed_assets CASCADE;
DROP TABLE IF EXISTS majed_businesses CASCADE;

-- Step 2: Create new tables (copy the content from supabase/schema.sql)
-- Or simply run the entire supabase/schema.sql file in the SQL Editor

-- Verification queries:
-- SELECT tablename FROM pg_tables WHERE tablename LIKE 'majed%';  -- Should return 0 rows
-- SELECT tablename FROM pg_tables WHERE tablename LIKE 'visibletoai%';  -- Should return 4 tables

