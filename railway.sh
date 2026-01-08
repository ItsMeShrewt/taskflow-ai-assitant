#!/bin/bash
set -e

echo "========================================="
echo "🚀 Railway Deployment Script"
echo "========================================="
echo "PHP Version: $(php -v | head -n 1)"
echo "PORT: $PORT"
echo "Date: $(date)"
echo "-----------------------------------------"

# CRITICAL: Unset DATABASE_URL if Railway provides one
unset DATABASE_URL

# Force SQLite configuration BEFORE any Laravel commands
export DB_CONNECTION=sqlite
export DB_DATABASE=/app/database/database.sqlite
export SESSION_DRIVER=file
export CACHE_STORE=file
export QUEUE_CONNECTION=sync

# Create database directory with full path
mkdir -p /app/database
mkdir -p /app/storage/framework/{cache/data,sessions,views}
mkdir -p /app/storage/logs
mkdir -p /app/bootstrap/cache

echo "Setting up storage directories..."
echo "Setting up storage directories..."
chmod -R 777 storage bootstrap/cache database

# Create SQLite database file with absolute path
echo "Creating SQLite database..."
touch /app/database/database.sqlite
chmod 666 /app/database/database.sqlite

# Create relative symlink for Laravel
if [ ! -f database/database.sqlite ]; then
    ln -sf /app/database/database.sqlite database/database.sqlite
fi

# Verify database file was created
if [ ! -f /app/database/database.sqlite ]; then
    echo "❌ Failed to create database file!"
    exit 1
fi

echo "✅ Database file created: $(ls -lh /app/database/database.sqlite)"

# Show current database configuration
echo "Database configuration:"
echo "  DB_CONNECTION: $DB_CONNECTION"
echo "  DB_DATABASE: $DB_DATABASE"

echo "Clearing all caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Verify environment is set correctly
echo "Verifying SQLite configuration..."
php -r "echo 'PHP PDO SQLite: ' . (extension_loaded('pdo_sqlite') ? 'Loaded' : 'NOT LOADED') . PHP_EOL;"
php artisan env | grep DB_ || echo "DB env vars:"
env | grep DB_

echo "Creating storage link..."
php artisan storage:link || true

# Generate app key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --force --no-interaction
fi

echo "Running migrations..."
php artisan migrate --force --no-interaction 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Migration failed! Checking database..."
    ls -la database/
    exit 1
fi

echo "✅ Migrations completed successfully"

echo "Optimizing..."
php artisan config:cache 2>&1
php artisan route:cache 2>&1

echo "✅ Application ready!"
echo "Starting PHP built-in server on 0.0.0.0:$PORT..."
echo "Server will be available at http://localhost:$PORT"
echo "========================================="

# Start the server with verbose output
php -S 0.0.0.0:$PORT -t public
