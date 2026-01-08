#!/bin/bash
set -e

echo "========================================="
echo "🚀 Railway Deployment Script"
echo "========================================="
echo "PHP Version: $(php -v | head -n 1)"
echo "PORT: $PORT"
echo "Date: $(date)"
echo "-----------------------------------------"

# Override database settings for Railway
export DB_CONNECTION=sqlite
export SESSION_DRIVER=file
export CACHE_STORE=file
export QUEUE_CONNECTION=sync

echo "Setting up storage directories..."
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
mkdir -p database
chmod -R 777 storage bootstrap/cache database

# Create SQLite database file
echo "Creating SQLite database..."
touch database/database.sqlite
chmod 666 database/database.sqlite

# Verify database file was created
if [ ! -f database/database.sqlite ]; then
    echo "❌ Failed to create database file!"
    exit 1
fi

echo "✅ Database file created: $(ls -lh database/database.sqlite)"

echo "Clearing all caches..."
php artisan cache:clear || true
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

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
