# 🔍 Login Issue - Troubleshooting Guide

## ✅ GOOD NEWS: Backend Server IS Running!

The server is running on port 5001 and responding to requests.

## Why Can't You Login? Here are the Most Common Reasons:

### 1. 🌐 Browser Cache Issue (MOST LIKELY)
Your browser may be caching the old CORS-blocked requests.

**SOLUTION:**
1. **Hard Refresh** your browser:
   - Chrome/Edge: `Ctrl + Shift + R` or `Ctrl + F5`
   - Firefox: `Ctrl + Shift + R`
2. **Clear Site Data:**
   - Press F12 (DevTools)
   - Right-click the refresh button → "Empty Cache and Hard Reload"
3. **Or use Incognito/Private Window:**
   - Press `Ctrl + Shift + N` (Chrome/Edge)
   - Press `Ctrl + Shift + P` (Firefox)

### 2. 👤 No User Account Yet
You might not have created an account.

**SOLUTION:**
1. Click "Sign Up" instead of "Login"
2. Create a new account
3. Then try logging in with those credentials

### 3. 🔐 Wrong Credentials
Make sure you're using the correct email and password.

**Test Account (if exists):**
- Email: `test@test.com`
- Password: `test123`

### 4. 🔄 Frontend Not Pointing to Correct API
Check if frontend is hitting the right URL.

**SOLUTION:**
- The frontend should be on: `http://localhost:5173`
- It should call API at: `http://localhost:5001/api`
- Check browser console (F12) for the actual API URL being called

### 5. 🚫 Still Seeing CORS Errors?
Even though server is running, you might see CORS errors.

**SOLUTION:**
1. **Restart the backend server:**
   - In the terminal where server is running, press `Ctrl + C`
   - Then run: `node server.js` again
   
2. **Kill all node processes and restart:**
   ```cmd
   taskkill /F /IM node.exe
   cd C:\xampp\htdocs\FurAdapt\backend
   node server.js
   ```

## 🧪 Quick Test

### Test 1: Can you reach the signup page?
1. Go to: `http://localhost:5173/signup`
2. Try creating a new account
3. If signup works, login should work too

### Test 2: Check Browser Console
1. Press F12
2. Go to Console tab
3. Try to login
4. Look for error messages
5. Check Network tab to see if requests are reaching `http://localhost:5001`

### Test 3: Check Network Tab
1. Press F12 → Network tab
2. Try to login
3. Look for the login request to `/api/auth/login`
4. Check the response:
   - **200 OK** = Success! Check if token is saved
   - **401 Unauthorized** = Wrong password
   - **404 Not Found** = API route issue
   - **CORS Error** = Backend not configured correctly (but we fixed this!)
   - **Failed to fetch / net::ERR_FAILED** = Backend not running (but it IS running!)

## 🎯 Most Likely Solution

**Do this NOW:**
1. Open Chrome/Edge in Incognito mode (`Ctrl + Shift + N`)
2. Go to `http://localhost:5173`
3. Click "Sign Up" and create a new account
4. Then login with that account

This will bypass any cache issues and should work immediately!

## 📊 What I Verified

✅ Backend server IS running on port 5001
✅ MongoDB is connected
✅ CORS is properly configured
✅ API endpoints are responding
✅ Login endpoint is working (returns "Invalid email or password" when tested)

## 🆘 If Nothing Works

Share this information:
1. Screenshot of browser console (F12 → Console)
2. Screenshot of Network tab showing the failed request
3. What error message you see when trying to login
