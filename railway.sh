#!/bin/bash
set -e

echo "PHP Version: $(php -v)"
echo "PORT: $PORT"

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
touch database/database.sqlite
chmod 666 database/database.sqlite

echo "Clearing all caches..."
php artisan cache:clear || true
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Creating storage link..."
php artisan storage:link || true

echo "Running migrations..."
php artisan migrate --force --no-interaction || echo "Migration skipped"

echo "Optimizing..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting PHP built-in server on 0.0.0.0:$PORT..."
exec php -S 0.0.0.0:$PORT -t public
