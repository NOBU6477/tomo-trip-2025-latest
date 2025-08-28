# 🚀 Replit Deployment Instructions

## Quick Setup for Replit

### 1. Import to Replit
1. Create new Repl from GitHub repository
2. Select **Node.js** as the language
3. Import this repository

### 2. Environment Configuration (Secrets)

Go to the **Secrets** tab in your Repl and add:

```bash
# Session encryption (generate a random 64-character string)
SESSION_SECRET=your_random_64_character_secret_key_make_it_secure_and_unique

# Database (if using PostgreSQL - optional)
DATABASE_URL=postgresql://user:password@host:port/database

# Environment
NODE_ENV=production
```

### 3. Run the Application

Simply click the **▶️ Run** button. The application will:
- Install dependencies automatically
- Start the Express.js server on port 5000
- Display the website in the Webview

### 4. Verify Deployment

Check these endpoints:
- **Main Site**: Your Repl URL (e.g., `https://your-repl.replit.dev`)
- **Health Check**: `https://your-repl.replit.dev/health`
- **API Info**: `https://your-repl.replit.dev/api`

### 5. Expected Console Output

```
🚀 TomoTrip Server running on port 5000
📊 Data stored in memory - stores: 0, guides: 0, reservations: 0
🔍 Health check: http://localhost:5000/health
📖 API info: http://localhost:5000/api
```

## Configuration Files (Already Set)

### .replit
```toml
run = "node server.js"
modules = ["nodejs-20", "postgresql-16"]

[interpreter]
language = "nodejs"

[[workflows.workflow]]
name = "TomoTripAPIServer"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "node server.js"
waitForPort = 5000
```

### package.json
```json
{
  "name": "tomotrip-tourism-guide-platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  }
}
```

## Features Available Immediately

✅ **Store Registration System**
✅ **Individual Store Management Dashboards**  
✅ **Tourism Guide Registration**
✅ **Reservation Management**
✅ **Multilingual Interface (Japanese/English)**
✅ **Mobile-Responsive Design**
✅ **Ocean Theme with Animations**

## Troubleshooting

### Port Issues
- Replit automatically assigns PORT environment variable
- Server uses `process.env.PORT || 5000`

### Dependencies 
- Run `npm install` in Shell if needed
- All dependencies will auto-install on first run

### Data Persistence
- Currently uses in-memory storage (resets on restart)
- For permanent data, set up PostgreSQL in Database tab

### Performance
- Optimized for Replit's environment
- Includes health monitoring endpoints
- CORS enabled for external access

## Production Features

✅ Health monitoring at `/health`  
✅ API documentation at `/api`  
✅ Proper error handling  
✅ Security headers  
✅ Mobile optimization  
✅ Real-time data updates  

**Ready to deploy! Just click Run 🚀**