# Railway Deployment Guide

## Recent Fixes Applied

### 1. Database Migration Issues ✅
- Fixed foreign key constraint in teams migration for SQLite compatibility
- Added proper error handling in railway.sh
- Added SQLite PHP extensions to nixpacks.toml

### 2. Startup Script Issues ✅
- Removed `php artisan tinker` command that was hanging
- Simplified migration verification
- Added APP_KEY auto-generation
- Better error output and logging

### 3. Nginx Permission Issues ✅ (Docker only)
- Fixed nginx temp directory permissions for file uploads

## Environment Variables Required on Railway

Make sure these are set in your Railway project:

```bash
APP_NAME="Smart Todo List"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=sqlite
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

## Deployment Steps

1. **Push to GitHub** (already done):
   ```bash
   git push origin main
   ```

2. **Railway Auto-Deploys**:
   - Railway will detect the push
   - Build phase: Installs dependencies, builds assets
   - Start phase: Runs `railway.sh`

3. **Check Deployment Logs**:
   - Go to Railway dashboard
   - Click on your service
   - View "Deployments" tab
   - Click on latest deployment
   - Check logs for:
     ```
     ✅ Database file created
     ✅ Migrations completed successfully
     ✅ Application ready!
     Starting PHP built-in server on 0.0.0.0:$PORT
     ```

4. **Verify Health Check**:
   ```bash
   curl https://your-app.railway.app/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "php_version": "8.3...",
     "laravel_version": "11.x"
   }
   ```

## Common Issues and Solutions

### Still Getting 502?

1. **Check Railway Logs**:
   - Look for error messages during startup
   - Check if migrations failed
   - Verify PHP version is 8.3

2. **Database Issues**:
   ```bash
   # Logs should show:
   ✅ Database file created: -rw-rw-rw- ... database.sqlite
   ✅ Migrations completed successfully
   ```

3. **PORT Variable**:
   - Railway automatically sets `$PORT`
   - Script uses `0.0.0.0:$PORT`
   - Default is usually 3000 or 8000

4. **APP_KEY Missing**:
   - Script now auto-generates if missing
   - Check logs for: "Generating application key..."

### Manual Debugging on Railway

If deployment succeeds but app doesn't work:

1. **SSH into Railway** (if available):
   ```bash
   railway shell
   ```

2. **Check database**:
   ```bash
   ls -la database/
   php artisan migrate:status
   ```

3. **Check logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Test manually**:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

## Files Modified for Railway

1. ✅ `railway.sh` - Main startup script
2. ✅ `nixpacks.toml` - Build configuration
3. ✅ `database/migrations/*` - SQLite compatibility
4. ✅ `routes/web.php` - Health check endpoint

## Next Deploy Should Work!

The fixes have been pushed. Railway will automatically:
1. ✅ Install PHP 8.3 with SQLite extensions
2. ✅ Build frontend assets
3. ✅ Create SQLite database
4. ✅ Run migrations successfully
5. ✅ Generate APP_KEY if needed
6. ✅ Start server on correct port
7. ✅ Respond to requests (no more 502!)

## Monitoring After Deployment

Watch for these success indicators in Railway logs:
- `✅ Database file created`
- `✅ Migrations completed successfully`  
- `✅ Application ready!`
- `[200]` response codes in access logs

If you still see 502, check the specific error in Railway deployment logs and share it for further debugging.
