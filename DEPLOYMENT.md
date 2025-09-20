# 🚀 Deployment Guide

This guide covers deploying the Eco Seedling Chronicles application with the backend on Vercel and frontend on Netlify.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Netlify account
- Google Cloud Console access (for OAuth)

## 🔧 Backend Deployment (Vercel)

### 1. Prepare Repository
1. Push your code to GitHub
2. Ensure `vercel.json` is in the backend folder

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `backend`
5. Click "Deploy"

### 3. Configure Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
GEMINI_API_KEY=AIzaSyAFRtGvofZki0VWJL2qPuJyAkMcyw9JhIs
GOOGLE_CLIENT_ID=96526225601-lqmfcqaponcdkt1i5p5fiadq0jbe0akn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
SESSION_SECRET=HABUYbYHBhbAUGUuihjbHGvbGUBVGbjB
FRONTEND_ORIGIN=https://your-app-name.netlify.app
SERVER_BASE=https://your-backend.vercel.app
NODE_ENV=production
```

**⚠️ Important:** Replace `your-app-name.netlify.app` and `your-backend.vercel.app` with your actual URLs.

## 🎨 Frontend Deployment (Netlify)

### 1. Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose your GitHub repository
4. Set **Base directory** to `frontend`
5. Set **Build command** to `npm run build`
6. Set **Publish directory** to `frontend/dist`
7. Click "Deploy site"

### 2. Configure Environment Variables
In Netlify Dashboard → Site → Site settings → Environment variables, add:

```
VITE_API_BASE_URL=https://your-backend.vercel.app
```

### 3. Update Production Environment
After deployment, update `frontend/.env.production` with your actual Vercel URL:

```
VITE_API_BASE_URL=https://your-actual-backend.vercel.app
```

## 🔐 Google OAuth Configuration

### Update Redirect URIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   - `https://your-backend.vercel.app/auth/google/callback`
   - `http://localhost:3000/auth/google/callback` (for development)

### Update Authorized Origins
Add these Authorized JavaScript origins:
- `https://your-app-name.netlify.app`
- `https://your-backend.vercel.app`
- `http://localhost:5173` (for development)
- `http://localhost:3000` (for development)

## 🔄 Post-Deployment Steps

### 1. Update Backend Environment Variables
After getting your Netlify URL, update these in Vercel:
- `FRONTEND_ORIGIN=https://your-actual-app.netlify.app`

### 2. Update Frontend Environment Variables
After getting your Vercel URL, update in Netlify:
- `VITE_API_BASE_URL=https://your-actual-backend.vercel.app`

### 3. Redeploy Both Applications
- Trigger a new deployment in Vercel
- Trigger a new deployment in Netlify

## 🧪 Testing Deployment

1. Visit your Netlify URL
2. Test Google OAuth login
3. Test community features
4. Test QR code scanning
5. Verify all API endpoints work

## 🐛 Common Issues

### CORS Errors
- Ensure `FRONTEND_ORIGIN` in Vercel matches your Netlify URL exactly
- Check that both HTTP and HTTPS versions are handled

### OAuth Errors
- Verify redirect URIs in Google Cloud Console
- Ensure `SERVER_BASE` environment variable is correct
- Check that OAuth credentials are properly set

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that build commands are correct
- Verify Node.js version compatibility

## 📱 Environment URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-backend.vercel.app`
- **API Endpoints**: `https://your-backend.vercel.app/api/*`

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and secrets
- Monitor deployment logs for security issues

## 📞 Support

If you encounter issues:
1. Check deployment logs in Vercel/Netlify dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints directly using tools like Postman
4. Check Google Cloud Console for OAuth configuration

---

**Happy Deploying! 🌱**
