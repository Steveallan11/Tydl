# Supabase Setup - Quick Start Checklist

## 🚀 Quick Setup (5 minutes)

Follow these steps to set up the Supabase database for Tydl MVP:

### ✅ Step 1: Run Database Schema (2 min)

1. Open Supabase dashboard: https://dqwjunoszmzedleqnqmb.supabase.co
2. Go to **SQL Editor** → **New Query**
3. Copy-paste entire contents of `docs/supabase-schema.sql`
4. Click **Run**
5. Wait for "Success" message

**Expected:** All tables created with no errors ✅

### ✅ Step 2: Update Environment Variables (1 min)

1. Update `.env.local` with these values:
```env
VITE_SUPABASE_URL=https://dqwjunoszmzedleqnqmb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2p1bm9zem16ZWRsZXFucW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTEzNjMsImV4cCI6MjA5MTY4NzM2M30.cj-huqFrXULWoyCOHl5U62mWg9dHLA0XkD4Bg_Q8UYM
```

2. Test build:
```bash
npm run build
```

**Expected:** Build succeeds with no errors ✅

### ✅ Step 3: Add to Vercel (2 min)

1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Add the same two variables as Step 2
4. Redeploy (Vercel will auto-detect and redeploy)

**Expected:** Deployment succeeds ✅

---

## 📋 What's Ready

- ✅ **Database Schema** - 6 tables with proper relationships
- ✅ **Phase 4 UI** - All customer, cleaner, admin pages complete
- ✅ **Mock Auth** - Works with localStorage (ready to migrate)
- ✅ **Mock Data** - Functional demo data in pages
- ✅ **Build Configuration** - TypeScript, Vite, Tailwind all working

---

## 🔄 What's Next: Phase 5 (Supabase Integration)

The UI is complete. Phase 5 is to replace mock implementations with real Supabase:

**Timeline:** 5 weeks total
- Week 1: Auth migration (signup/login with Supabase)
- Week 2: Customer & Cleaner data (bookings, jobs)
- Week 3: Admin data (assignment, status updates)
- Week 4: Testing & optimization
- Week 5: RLS policies for security

**See:** `docs/PHASE-5-SUPABASE-MIGRATION.md` for detailed plan

---

## 📚 Documentation Files

All documentation is in `docs/`:

1. **SUPABASE-SETUP.md** - Detailed setup guide with troubleshooting
2. **supabase-schema.sql** - Complete database schema
3. **PHASE-5-SUPABASE-MIGRATION.md** - Implementation plan for migrations

---

## 🧪 Testing After Setup

### Verify Tables Created:
```bash
# Go to Supabase SQL Editor and run:
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
```

Expected output:
```
booking_history
bookings
cleaner_ratings
cleaners
customers
admin_users
```

### Load Sample Data (Optional):
```bash
# In Supabase SQL Editor, uncomment and run the sample data section
# from docs/supabase-schema.sql

# This creates:
# - 2 sample customers
# - 3 sample cleaners
# - 1 sample admin user
```

---

## 🔐 Security Notes

**Current MVP Status:**
- ✅ Database schema with proper relationships
- ✅ Indexes for performance
- ✅ Timestamps auto-managed by triggers
- ⏳ RLS policies (will add in Phase 5)
- ⏳ Auth user management (will add in Phase 5)

**For Production (Phase 5):**
- Enable RLS on all tables
- Set up proper auth roles
- Restrict API key permissions
- Add rate limiting

---

## 🆘 Troubleshooting

**Issue: "Table already exists" error**
→ Schema was already run. If you need a clean slate, drop tables first:
```sql
DROP TABLE IF EXISTS cleaner_ratings CASCADE;
DROP TABLE IF EXISTS booking_history CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS cleaners CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
```

**Issue: Build fails with "Cannot find module 'supabase'"**
→ Make sure you've installed dependencies:
```bash
npm install
npm run build
```

**Issue: Environment variables not loading**
→ Restart dev server:
```bash
npm run dev
```

**Issue: Need to reset database**
→ Go to Supabase settings → Danger Zone → Reset database

---

## 📞 Getting Help

If you run into issues:
1. Check `docs/SUPABASE-SETUP.md` troubleshooting section
2. Verify all 3 steps above are completed
3. Check browser console for errors (F12)
4. Verify Supabase credentials are correct

---

## ✨ You're All Set!

The database is ready. The UI is complete. The next phase is to wire them together with real Supabase queries.

**Next Command:** Start Phase 5 migration when ready:
```bash
# Review the migration plan
cat docs/PHASE-5-SUPABASE-MIGRATION.md

# Then begin updating contexts and pages to use Supabase
```
