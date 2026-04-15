# Local Development Guide

## 🚀 Running the App Locally

### Prerequisites
- Node.js 18+ installed
- `npm` or `yarn` package manager
- Git configured

### Setup

1. **Install dependencies** (one-time only):
```bash
npm install
```

2. **Set up environment variables**:
   - Copy `.env.local` to root if it doesn't exist
   - Ensure it has:
     ```
     VITE_SUPABASE_URL=https://dqwjunoszmzedleqnqmb.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     VITE_STRIPE_PUBLIC_KEY=pk_test_...
     ```

3. **Start the dev server**:
```bash
npm run dev
```

This will start a local server (typically at `http://localhost:5173`)

## 🧪 Testing Workflow

### Development Cycle
1. Make code changes
2. Save the file (hot reload happens automatically!)
3. Test in browser at `http://localhost:5173`
4. Check console for errors (F12 or Cmd+Option+I)
5. Repeat until happy

### No More Costly Builds!
- **Local testing is FREE** - no Vercel costs
- Changes appear instantly on save
- Test booking flows, admin features, everything locally
- Only push to Vercel when satisfied

## 🔍 What to Test Locally

### Booking Flow
- Go through complete booking flow
- Check price updates in real-time
- Test address pre-fill if logged in
- Click add-on info buttons to see descriptions
- Test payment form validation

### Admin Dashboard
- Log in as admin
- Check bookings display correctly
- Test cleaner management tab
- Try adding a new cleaner
- Verify search and filtering works

### Cleaner Features
- Navigate to cleaner pages
- Test job listings
- Verify profile updates work

## ⚡ Useful Commands

```bash
# Development server (auto-reload on changes)
npm run dev

# Type check (catch TypeScript errors)
npm run typecheck

# Build for production (test if build works)
npm run build

# Preview production build locally
npm run preview

# Lint code (find style issues)
npm run lint
```

## 🐛 Debugging

### Check Browser Console
Press `F12` or `Cmd+Option+I` to open Developer Tools:
- Console: See JavaScript errors and logs
- Network: Check API calls to Supabase
- Application: View stored data

### Check Terminal Output
Your `npm run dev` terminal will show:
- Build errors
- Hot reload notifications
- Any server-side errors

### Common Issues

**"Module not found" error:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

**Changes not showing:**
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check the file was actually saved

**Port already in use (5173):**
```bash
# Vite will auto-select next available port
# Check terminal output for actual URL
```

## 📦 When to Deploy to Vercel

Deploy to Vercel ONLY when:
1. ✅ Feature works correctly locally
2. ✅ No console errors
3. ✅ No TypeScript errors (`npm run typecheck`)
4. ✅ Build succeeds (`npm run build`)
5. ✅ You've tested the actual user flows
6. ✅ You're ready to show it to users

### Deploying to Vercel

Once you're happy with changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Your commit message"

# 2. Push to branch
git push -u origin your-branch-name

# 3. Vercel auto-deploys on push OR
#    create PR and Vercel will build preview

# 4. Check Vercel dashboard for build status
#    https://vercel.com/steveallan11/tydl
```

## 💰 Cost Savings

### Before (Testing on Vercel)
- Every code change = Vercel build
- Builds cost money
- Takes 2-5 minutes per build
- Multiple builds per feature = expensive

### After (Local Development)
- Make changes → instant test → FREE
- Only deploy to Vercel when ready
- Save $$ and development time
- Catch errors before production

## 🎯 Recommended Workflow

```
1. Create new branch
   git checkout -b feature/your-feature

2. Make changes locally
   npm run dev
   [Make code changes]
   [Test thoroughly]

3. Test complete flows
   Book a service → Check admin → Verify payment

4. When happy, commit
   git add .
   git commit -m "Feature complete and tested locally"

5. Push to Vercel
   git push origin feature/your-feature

6. Create PR (optional)
   Vercel builds preview automatically
   Share preview with team/stakeholders

7. Merge when approved
   Changes go live automatically
```

## ✨ Quick Tips

- Keep `npm run dev` running while working
- Open DevTools (F12) in another window
- Test on mobile size too (DevTools → Toggle device toolbar)
- Clear browser cache if styles look wrong
- Commit frequently (every working feature)

## Need Help?

If you run into issues:
1. Check the error in browser console (F12)
2. Run `npm run typecheck` to find TypeScript errors
3. Try `npm install` to ensure all packages are updated
4. Hard refresh the page: `Cmd+Shift+R` or `Ctrl+Shift+R`
5. Restart `npm run dev` if changes aren't showing

Happy local development! 🎉
