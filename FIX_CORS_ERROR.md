# 🚨 CORS Error - Backend Server Not Running

## Problem
Your backend server is NOT running! That's why you're getting CORS errors.

## ✅ SOLUTION - Start the Backend Server

### Option 1: Using the Batch File (EASIEST)
1. Open the backend folder: `C:\xampp\htdocs\FurAdapt\backend`
2. Double-click `start-server.bat`
3. A terminal window will open showing the server status

### Option 2: Using Command Prompt
```cmd
cd C:\xampp\htdocs\FurAdapt\backend
node server.js
```

### Option 3: Using VS Code Terminal
1. Open a NEW terminal in VS Code (Terminal → New Terminal)
2. Run:
```cmd
cd C:\xampp\htdocs\FurAdapt\backend
node server.js
```

## Expected Output
When the server starts successfully, you should see:
```
Server running on port 5001
MongoDB Connected: <your-connection-string>
```

## ⚠️ Make Sure MongoDB is Running!
If you see "MongoDB connection error", start MongoDB:
1. Open Services (Windows Key + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click → Start

OR if using XAMPP MongoDB:
1. Open XAMPP Control Panel
2. Start MongoDB service

## What I Fixed
✅ Improved CORS configuration in `server.js`
✅ Added explicit origins: `http://localhost:5173`
✅ Enabled pre-flight OPTIONS requests
✅ Moved CORS middleware to be first (important!)
✅ Created `start-server.bat` for easy server startup

## After Starting the Server
1. Keep the backend terminal running (don't close it!)
2. Go back to your frontend at `http://localhost:5173`
3. Try logging in again
4. All CORS errors should be gone! ✨

## Troubleshooting

### Error: "Cannot find module"
- Make sure you're in the correct directory
- Run `npm install` in the backend folder first

### Error: "Port 5001 is already in use"
- Another process is using port 5001
- Kill the process or change the PORT in `.env` file

### Error: "MongoDB connection failed"
- Check if MongoDB is running
- Verify MONGO_URI in `.env` file

### Still Getting CORS Errors?
1. Hard refresh your browser (Ctrl + Shift + R)
2. Clear browser cache
3. Make sure backend is running on port 5001
4. Check backend console for any errors

## Need to Stop the Server?
Press `Ctrl + C` in the terminal where the server is running
