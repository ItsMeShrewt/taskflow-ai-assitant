#!/bin/bash
set -e

echo "Setting up storage directories..."
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
chmod -R 775 storage bootstrap/cache

echo "Creating storage link..."
php artisan storage:link || true

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

echo "Starting server on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
