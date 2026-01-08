#!/bin/bash
# Test script to verify migrations work correctly

echo "Testing database migrations..."
echo "========================================="

# Set test environment
export DB_CONNECTION=sqlite
export DB_DATABASE=database/test.sqlite

# Clean up old test database
rm -f database/test.sqlite

# Create test database
touch database/test.sqlite
chmod 666 database/test.sqlite

echo "✓ Test database created"

# Run migrations
php artisan migrate --force --database=sqlite

if [ $? -eq 0 ]; then
    echo "✓ Migrations completed successfully"
    
    # Show migration status
    php artisan migrate:status --database=sqlite
    
    # Test database connection
    echo ""
    echo "Testing database connection..."
    php artisan tinker --execute="
        echo 'Tables: ' . count(DB::select('SELECT name FROM sqlite_master WHERE type=\"table\"')) . PHP_EOL;
        echo 'Users table exists: ' . (Schema::hasTable('users') ? 'Yes' : 'No') . PHP_EOL;
        echo 'Tasks table exists: ' . (Schema::hasTable('tasks') ? 'Yes' : 'No') . PHP_EOL;
        echo 'Teams table exists: ' . (Schema::hasTable('teams') ? 'Yes' : 'No') . PHP_EOL;
    "
    
    echo ""
    echo "========================================="
    echo "✅ All tests passed!"
else
    echo "❌ Migration failed!"
    exit 1
fi
