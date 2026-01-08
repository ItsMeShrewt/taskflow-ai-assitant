#!/bin/sh

# Docker entrypoint script for Laravel application
set -e

echo "🚀 Starting Laravel application setup..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
for i in $(seq 1 30); do
    if nc -z db 3306 2>/dev/null; then
        echo "✅ Database is ready!"
        break
    fi
    echo "Database is unavailable - sleeping (attempt $i/30)"
    sleep 2
done

# Check if .env exists, if not copy from .env.example
if [ ! -f /var/www/.env ]; then
    echo "📝 Creating .env file..."
    cp /var/www/.env.example /var/www/.env
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" /var/www/.env; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force || true

# Seed database if empty (skip if fails)
echo "🌱 Seeding database..."
php artisan db:seed --force 2>/dev/null || echo "Skipping seed (already seeded or failed)"

# Clear and cache config
echo "🧹 Optimizing application..."
php artisan config:clear
php artisan route:clear

# Create storage link if it doesn't exist
if [ ! -L /var/www/public/storage ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link || true
fi

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Create nginx temp directories and set permissions
mkdir -p /var/lib/nginx/tmp/client_body \
         /var/lib/nginx/tmp/proxy \
         /var/lib/nginx/tmp/fastcgi \
         /var/lib/nginx/tmp/uwsgi \
         /var/lib/nginx/tmp/scgi

# Fix all nginx directory permissions so www-data can access them
chmod 755 /var/lib/nginx
chmod 755 /var/lib/nginx/tmp
chown -R www-data:www-data /var/lib/nginx/tmp
chmod -R 755 /var/lib/nginx/tmp

echo "✨ Application setup complete!"
echo "🌐 Application is ready at http://localhost:8000"

# Execute the main command (supervisord)
exec "$@"
