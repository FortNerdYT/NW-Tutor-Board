# Deployment Guide

This guide covers deploying the Tutor Board application to production using **free tiers**.

## Prerequisites

- Google Cloud project with OAuth credentials
- Supabase project (free tier available)
- Vercel account (free for hobby projects)
- Render account (free tier available)
- GitHub repository with your code

## Step 1: Set Up Supabase (Free)

1. Create a new project at [supabase.com](https://supabase.com) - Free tier includes 500MB database
2. Go to SQL Editor and run the schema from `backend/supabase-schema.sql`
3. Navigate to Project Settings → API
4. Copy the following:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

## Step 2: Set Up Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Configure consent screen:
   - Application type: Web application
   - Authorized redirect URIs (we'll add these after deployment):
     - `https://your-app.onrender.com/api/auth/google/callback`
6. Copy Client ID and Client Secret

## Step 3: Deploy Backend to Render (Free)

1. Create a new Web Service on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `FortNerdYT/NW-Tutor-Board`
4. Configure:
   - Name: `tutor-board-backend`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - **Important**: Uncheck "Auto-Deploy" if it tries to auto-detect settings
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
6. Click "Create Web Service" - It will deploy on the free tier
7. Copy the backend URL (e.g., `https://tutor-board-backend.onrender.com`)

## Step 4: Deploy Frontend to Vercel (Free)

1. Create a new project on [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `FortNerdYT/NW-Tutor-Board`
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```
6. Click "Deploy" - Free for hobby projects
7. Copy the frontend URL (e.g., `https://tutor-board.vercel.app`)

## Step 5: Update Google OAuth Redirect URIs

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client ID
3. Edit the authorized redirect URIs
4. Add your backend callback URL:
   ```
   https://your-app.onrender.com/api/auth/google/callback
   ```
5. Save

## Step 6: Update Backend CLIENT_URL

1. Go to your Render project
2. Navigate to "Environment"
3. Update `CLIENT_URL` to your actual Vercel frontend URL:
   ```
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```
4. Render will automatically redeploy

## Environment Variables Reference

### Backend (Render)
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

### Frontend (Vercel)
```
VITE_API_URL=https://your-app.onrender.com
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
