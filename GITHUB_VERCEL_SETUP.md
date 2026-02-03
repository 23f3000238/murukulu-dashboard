# GitHub & Vercel Deployment Guide

## ✅ Current Status

Your Murukulu Dashboard project is **production-ready** and includes:

- ✅ All source code committed to git
- ✅ Development server tested and working
- ✅ Production build verified
- ✅ All dependencies installed
- ✅ Environment configuration ready

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to [GitHub.com](https://github.com/new)
2. Click **"New repository"** button
3. Fill in details:
   - **Repository name:** `murukulu-dashboard`
   - **Description:** "Government PDF Report Dashboard with Data Analysis"
   - **Visibility:** Public or Private (your choice)
   - **Do NOT** initialize with README/gitignore (we already have them)
4. Click **"Create repository"**

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI (if not already installed)
# https://cli.github.com/

gh repo create murukulu-dashboard --source=. --remote=origin --push
```

## Step 2: Push Code to GitHub

### Using HTTPS (Recommended for beginners)

```bash
cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"

# Set remote URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/murukulu-dashboard.git

# Rename branch to main (optional but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Using SSH (More secure for frequent pushes)

```bash
# First, set up SSH keys (one-time setup)
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh

cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"

# Set remote URL
git remote add origin git@github.com:YOUR_USERNAME/murukulu-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Web Interface (Easiest)

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign up"** or **"Log in"** with your GitHub account
3. Click **"New Project"**
4. Select your GitHub account
5. Find and select **`murukulu-dashboard`** repository
6. Vercel will auto-detect it's a Next.js project
7. Click **"Deploy"**

**That's it!** Your app will be live in ~2-3 minutes.

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"
vercel

# Follow the prompts:
# - Set project name: murukulu-dashboard
# - Link to existing project? No
# - Set production branch: main
```

## Step 4: Verify Deployment

After deployment, you'll get a live URL like:
```
https://murukulu-dashboard.vercel.app
```

### Test the deployment:

1. **Visit your URL** in a browser
2. **Upload a test PDF** to verify:
   - File upload works
   - PDF parsing functions
   - Data displays correctly
   - Export to Excel works

### Common URL Formats:

- **Production:** `https://murukulu-dashboard.vercel.app`
- **Preview (PR):** `https://murukulu-dashboard-pr-1.vercel.app`
- **Custom Domain:** `https://your-custom-domain.com`

## Environment Variables (if needed)

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Add any environment variables (if applicable)

For this project, none are required by default, but you can add:
```
NODE_ENV=production
```

## Adding Custom Domain (Optional)

1. In Vercel Dashboard → **Domains**
2. Click **"Add"**
3. Enter your custom domain (e.g., `murukulu.yourdomain.com`)
4. Follow DNS configuration instructions

## Continuous Deployment

Once your GitHub repo is connected to Vercel:

- Every push to `main` branch = automatic deployment
- Pull requests get preview deployments
- Deployments are instant and automatic
- No manual steps needed!

### Example workflow:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# ✅ Automatically deployed to Vercel!
```

## Updating Code After Deployment

1. **Make changes locally:**
   ```bash
   # Edit files in your project
   ```

2. **Commit changes:**
   ```bash
   cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Vercel auto-deploys** (no additional steps!)

## Monitoring & Logs

### In Vercel Dashboard:

1. **Deployments** tab - see all deployment history
2. **Logs** - real-time server output
3. **Analytics** - traffic and performance stats
4. **Functions** - API performance metrics

### View live logs:
```bash
vercel logs --follow
```

## Troubleshooting

### "Build failed" on Vercel

1. Check build logs in Vercel Dashboard
2. Run locally: `npm run build`
3. Fix any errors shown
4. Push to GitHub again (auto-redeploy)

### "Module not found" errors

```bash
# Install missing dependencies
npm install

# Or update dependencies
npm update

# Rebuild and push
npm run build
git add .
git commit -m "Fix dependencies"
git push
```

### "Cannot find module: pdf-parse"

Ensure all dependencies are in `package.json`:
```bash
npm install pdf-parse formidable xlsx --save
```

### Deployment takes too long

- First deployment: 2-3 minutes (normal)
- Subsequent: 30-60 seconds
- Large dependencies may add time

## Performance Tips

### 1. Images & Assets
- Use `/public` folder for static files
- Vercel CDN automatically optimizes

### 2. Environment
- Set `NODE_ENV=production` in production
- Vercel does this automatically

### 3. Monitoring
- Monitor uptime in Vercel Dashboard
- Check Analytics for traffic patterns
- Review error logs regularly

## Security Best Practices

1. **Never commit secrets:**
   ```bash
   # Use .env.local (already in .gitignore)
   echo "API_KEY=secret" > .env.local
   ```

2. **Add to Vercel Secrets:**
   - Dashboard → Settings → Environment Variables
   - Add sensitive values there

3. **Keep dependencies updated:**
   ```bash
   npm update
   npm audit fix
   ```

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Build for production
npm start                # Start production server

# Git commands
git status               # See changes
git log                  # View commit history
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
git pull                 # Pull latest from GitHub

# Vercel commands
vercel                   # Deploy current project
vercel --prod            # Deploy to production
vercel logs              # View live logs
vercel env ls            # List environment variables
vercel env add VAR VALUE # Add environment variable
```

## Post-Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] Vercel deployment successful
- [ ] Live URL accessible
- [ ] PDF upload tested
- [ ] Data parsing verified
- [ ] Excel export working
- [ ] Mobile view tested
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set (if needed)
- [ ] Team members added (if applicable)

## Next Steps

### Immediate:
1. Share the live URL with users
2. Test with real PDF files
3. Monitor for errors in Vercel logs

### Short-term:
- Add more PDF format support
- Implement user authentication
- Add data persistence (database)
- Create API documentation

### Long-term:
- Add admin dashboard
- Implement batch processing
- Add email notifications
- Create mobile app
- Expand data analytics

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Docs:** https://docs.github.com
- **PDF-Parse Docs:** https://www.npmjs.com/package/pdf-parse

## Quick Links

- **Your Project Directory:** `c:\Users\srina\Downloads\murukulu-dashboard (1)`
- **GitHub:** https://github.com/NEW (create your account)
- **Vercel:** https://vercel.com
- **Production URL (after deployment):** https://murukulu-dashboard.vercel.app

---

## Ready to Deploy? Start Here:

### 1️⃣ Create GitHub Repo
```bash
# Go to https://github.com/new
# Create repository named "murukulu-dashboard"
```

### 2️⃣ Push Code
```bash
cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"
git remote add origin https://github.com/YOUR_USERNAME/murukulu-dashboard.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy to Vercel
```bash
# Visit https://vercel.com
# Click "New Project" and select your GitHub repo
# Click "Deploy"
```

### 4️⃣ Done! 🎉
Your app is now live on Vercel!

---

**Need help?** Check the troubleshooting section above or refer to official documentation.

**Project Status:** ✅ Ready for Production Deployment
