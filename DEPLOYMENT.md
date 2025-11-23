# Deployment Guide for nym

This guide will help you deploy nym to Railway without Docker.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with your code
- OpenAI API key

## Step 1: Create a New Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your nym repository

## Step 2: Set Up PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. Copy the `DATABASE_URL` connection string (it will be available in the database service's variables)

## Step 3: Deploy Backend

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your nym repository
3. Configure the backend service:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

4. Add environment variables for backend:
   ```
   DATABASE_URL=<from PostgreSQL service>
   OPENAI_API_KEY=<your OpenAI API key>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=<will be provided after frontend deployment>
   ```

5. Deploy the backend service

## Step 4: Deploy Frontend

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your nym repository again
3. Configure the frontend service:
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

4. Add environment variables for frontend:
   ```
   NEXT_PUBLIC_API_URL=<backend service URL>
   NEXT_PUBLIC_MONAD_RPC_URL=<Monad RPC URL when available>
   ```

5. Deploy the frontend service

## Step 5: Update CORS Settings

1. Go back to backend service
2. Update the `FRONTEND_URL` environment variable with the frontend service URL
3. Redeploy the backend service

## Step 6: Configure Custom Domain (Optional)

1. In Railway, go to your frontend service
2. Click "Settings" → "Domains"
3. Add a custom domain if desired
4. Update DNS records as instructed

## Environment Variables Summary

### Backend Service
```env
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

### Frontend Service
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-rpc-url
```

### PostgreSQL Service
Automatically configured by Railway.

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in package.json
- Ensure build commands are correct
- Check Railway build logs for specific errors

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Ensure PostgreSQL service is running
- Check that backend has access to the database service

### CORS Errors
- Verify FRONTEND_URL is set correctly in backend
- Ensure both services are deployed and running
- Check that URLs don't have trailing slashes

## Monitoring

Railway provides built-in monitoring:
- View logs in each service's "Logs" tab
- Monitor resource usage in "Metrics" tab
- Set up alerts for service failures

## Scaling

To scale your application:
1. Go to service settings
2. Adjust "Replicas" count
3. Consider upgrading your Railway plan for more resources

## Notes

- Railway automatically handles SSL certificates
- Services restart automatically on crashes
- Zero-downtime deployments are supported
- Environment variables can be updated without redeploying

