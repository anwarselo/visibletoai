# Manual Steps Required - Supabase Configuration

## ⚠️ IMPORTANT: Complete these steps before continuing

The code has been updated to use `visibletoai_*` table names and bucket names. You need to manually configure Supabase to match.

### Step 1: Drop Old Tables & Create New Tables

Go to your Supabase project SQL Editor and run:

```sql
-- Drop old majed_* tables
DROP TABLE IF EXISTS majed_index_events CASCADE;
DROP TABLE IF EXISTS majed_public_pages CASCADE;
DROP TABLE IF EXISTS majed_assets CASCADE;
DROP TABLE IF EXISTS majed_businesses CASCADE;
```

Then run the entire contents of `supabase/schema.sql` to create the new `visibletoai_*` tables.

**Verify:**
```sql
SELECT tablename FROM pg_tables WHERE tablename LIKE 'visibletoai%';
```
Should return 4 tables: `visibletoai_businesses`, `visibletoai_assets`, `visibletoai_public_pages`, `visibletoai_index_events`

### Step 2: Create New Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Delete the old `majed_business_assets` bucket
3. Create new bucket: `visibletoai_business_assets`
4. Make it **Public**
5. Add policy for public read access

### Step 3: Restart Dev Server

After completing the above steps, restart the dev server:

```bash
pkill -f "pnpm dev"
cd "/Volumes/X10 Pro/Majed/microsite"
PORT=3000 nohup pnpm dev > /tmp/microsite-dev.log 2>&1 &
```

### Status

- ✅ All code updated to use `visibletoai_*` references
- ✅ `.env.local` updated with new bucket name
- ✅ `config.env.example` updated
- ✅ All tests updated
- ✅ Lint passing
- ⏳ **WAITING**: Supabase tables to be created
- ⏳ **WAITING**: Storage bucket to be created
- ⏳ **WAITING**: Dev server to be restarted

### What's Next

After you complete the above steps, I will continue with:
- Phase 7: Add SEO meta tags
- Phase 8: Add IndexNow status footer
- Phase 9-11: Enhanced robots.txt, sitemap, and IndexNow key file
- Phase 12: Final testing
- Phase 13: Commit and push

**Let me know when you've completed the Supabase configuration!**

