# Profile Loading Troubleshooting Guide

## Problem: "Failed to load profile data" error

## Step-by-Step Debugging

### 1. Check if Backend Server is Running
Open a terminal and check:
```cmd
cd c:\xampp\htdocs\FurAdapt\backend
node server.js
```
Expected output: "Server running on port 5001" and "MongoDB Connected"

### 2. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for these debug messages:
   - "Fetching profile data..." (on load)
   - "Profile data received:" (on success)
   - "Using authUser from context:" (if fallback is used)
   - Any red error messages

### 3. Check Network Tab
1. Open DevTools → Network tab
2. Refresh the profile page
3. Look for `GET http://localhost:5001/api/auth/profile`
4. Check the response:
   - **200 OK**: Server responded successfully
   - **401 Unauthorized**: Token is invalid/expired → Log out and log in again
   - **404 Not Found**: Backend route not configured
   - **Failed to fetch**: Backend server is not running

### 4. Check Token in LocalStorage
1. Open DevTools → Application tab
2. Go to Local Storage → `http://localhost:3000`
3. Check if `token` and `user` exist
4. If missing → Log in again

### 5. Test Backend Directly
Use this PowerShell command to test the endpoint:
```powershell
$token = "YOUR_TOKEN_FROM_LOCALSTORAGE"
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/profile" -Headers $headers
```

## Common Solutions

### Solution 1: Backend Not Running
```cmd
cd c:\xampp\htdocs\FurAdapt\backend
npm install
node server.js
```

### Solution 2: Token Expired
1. Log out from the app
2. Log in again
3. Try accessing profile

### Solution 3: CORS Issues
Check `backend/server.js` has proper CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Solution 4: MongoDB Not Connected
1. Make sure MongoDB is running
2. Check `.env` file has correct `MONGO_URI`
3. Check backend console for "MongoDB Connected" message

## Recent Enhancements

The profile component now has these safety features:
1. ✅ Tries to fetch from API first
2. ✅ Falls back to cached user data if API fails
3. ✅ Shows helpful error message with console logs
4. ✅ Provides "Retry" and "Go Home" buttons

## What to Report

If issue persists, please report:
1. Console error messages (screenshot)
2. Network tab response for the profile API call
3. Whether token exists in localStorage
4. Backend server console output
