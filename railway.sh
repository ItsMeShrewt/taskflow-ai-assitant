#!/bin/bash
set -e

echo "PHP Version: $(php -v)"
echo "PORT: $PORT"

echo "Setting up storage directories..."
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
chmod -R 775 storage bootstrap/cache

echo "Clearing caches..."
php artisan cache:clear || true
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Creating storage link..."
php artisan storage:link || true

echo "Running migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

echo "Optimizing..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting PHP built-in server on 0.0.0.0:$PORT..."
exec php -S 0.0.0.0:$PORT -t public public/index.php
