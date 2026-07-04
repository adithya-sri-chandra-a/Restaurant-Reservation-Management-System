# Deployment Guide for RRMS

## 1. Frontend (Vercel)
### Build settings
- Framework: Vite
- Build command: npm run build
- Output directory: dist

### Environment variables
Create these in Vercel:
- VITE_API_URL=https://your-backend-url.onrender.com/api

### Notes
- The frontend uses Vite and reads the API base URL from VITE_API_URL.
- Make sure the frontend origin is allowed by the backend CORS policy.

## 2. Backend (Render)
### Build settings
- Build command: npm install
- Start command: npm start

### Environment variables
Set these in Render:
- NODE_ENV=production
- PORT=10000
- MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rrms?retryWrites=true&w=majority
- JWT_SECRET=strong-production-secret
- JWT_EXPIRES_IN=7d

### Notes
- The backend should use MongoDB Atlas for production.
- Ensure the Render service has access to the environment variables.

## 3. CORS Configuration
The backend should allow the frontend origin.
Example:
- Set CORS origin to https://your-frontend.vercel.app

## 4. Production Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Backend env vars configured in Render
- [ ] Frontend env vars configured in Vercel
- [ ] CORS updated for production frontend domain
- [ ] Health endpoint verified
- [ ] Authentication flow tested
- [ ] Reservation flow tested
- [ ] Admin routes tested

## 5. Suggested Deployment Steps
1. Deploy MongoDB Atlas and get the connection string.
2. Deploy the backend to Render with the above env vars.
3. Deploy the frontend to Vercel with VITE_API_URL pointing to the Render backend URL.
4. Verify the app end-to-end.
