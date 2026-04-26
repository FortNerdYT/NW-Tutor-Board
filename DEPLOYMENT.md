# Deployment Guide

This guide covers deploying the Tutor Board application to production.

## Prerequisites

- Google Cloud project with OAuth credentials
- Supabase project
- Vercel account (for frontend)
- Railway or Render account (for backend)
- GitHub repository with your code

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub
3. Push your code:
   ```bash
   git remote add origin https://github.com/your-username/tutor-board.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `backend/supabase-schema.sql`
3. Navigate to Project Settings → API
4. Copy the following:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

## Step 3: Set Up Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Configure consent screen:
   - Application type: Web application
   - Authorized redirect URIs (we'll add these after deployment):
     - `https://your-backend-domain.railway.app/api/auth/google/callback`
6. Copy Client ID and Client Secret

## Step 4: Deploy Backend to Railway

1. Create a new project on [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   ```
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=generate_random_string_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```
6. Click Deploy
7. Copy the backend URL (e.g., `https://tutor-board-backend.railway.app`)

## Step 5: Deploy Frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Vite
   - Root Directory: `frontend`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-domain.railway.app
   ```
5. Click Deploy
6. Copy the frontend URL (e.g., `https://tutor-board.vercel.app`)

## Step 6: Update Google OAuth Redirect URIs

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client ID
3. Edit the authorized redirect URIs
4. Add your backend callback URL:
   ```
   https://your-backend-domain.railway.app/api/auth/google/callback
   ```
5. Save

## Step 7: Update Backend CLIENT_URL

1. Go to your Railway project
2. Navigate to Variables
3. Update `CLIENT_URL` to your actual Vercel frontend URL:
   ```
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```
4. Railway will automatically redeploy

## Alternative: Render for Backend

If you prefer Render over Railway:

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add the same environment variables as Railway
5. Deploy
6. The callback URL will be: `https://your-app.onrender.com/api/auth/google/callback`

## Environment Variables Reference

### Backend
```
PORT=5000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=random_secret_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Frontend
```
VITE_API_URL=https://your-backend-domain.railway.app
```

## Testing the Deployment

1. Visit your Vercel frontend URL
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Select your role (Teacher/Student)
5. Test creating/viewing requests

## Troubleshooting

### OAuth Redirect URI Mismatch
- Ensure the redirect URI in Google Cloud Console exactly matches your backend URL
- Include the full path: `/api/auth/google/callback`
- Use `https://` not `http://` for production

### CORS Errors
- Ensure `CLIENT_URL` in backend matches your frontend domain exactly
- Check that CORS is configured correctly in `backend/src/server.js`

### Database Errors
- Verify Supabase credentials are correct
- Check that the schema was applied correctly
- Ensure Supabase project is active

### Frontend Can't Reach Backend
- Verify `VITE_API_URL` is correct
- Check that backend is deployed and running
- Ensure backend allows CORS from your frontend domain

## Security Notes

- Never commit `.env` files to version control
- Use strong, random values for `SESSION_SECRET` (use: `openssl rand -base64 32`)
- Keep `SUPABASE_SERVICE_KEY` secret - it has admin privileges
- Regularly rotate API keys
- Enable additional authentication methods in production if needed
