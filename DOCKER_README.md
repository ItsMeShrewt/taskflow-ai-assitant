# Docker Setup Guide

This project includes Docker support for easy development and deployment.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Build and Start Containers

```bash
docker-compose up -d --build
```

This will start:
- **App Container** (port 8000): Laravel application with Nginx and PHP-FPM
- **Database Container** (port 3306): MySQL 8.0
- **PHPMyAdmin** (port 8080): Database management interface

### 2. Install Dependencies (First Time Setup)

```bash
# Enter the app container
docker exec -it todo-app sh

# Inside the container, run migrations
php artisan migrate --seed

# Generate application key if needed
php artisan key:generate

# Create storage link
php artisan storage:link

# Exit container
exit
```

### 3. Access the Application

- **Application**: http://localhost:8000
- **PHPMyAdmin**: http://localhost:8080
  - Server: db
  - Username: todo_user
  - Password: todo_password

## Common Commands

### Start/Stop Containers

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes (WARNING: This deletes the database)
docker-compose down -v
```

### Access Container Shell

```bash
# Access app container
docker exec -it todo-app sh

# Access database container
docker exec -it todo-db bash
```

### Laravel Artisan Commands

```bash
# Run migrations
docker exec todo-app php artisan migrate

# Run seeders
docker exec todo-app php artisan db:seed

# Clear cache
docker exec todo-app php artisan cache:clear
docker exec todo-app php artisan config:clear
docker exec todo-app php artisan route:clear
docker exec todo-app php artisan view:clear

# Run queue worker
docker exec todo-app php artisan queue:work
```

### View Logs

```bash
# View all container logs
docker-compose logs -f

# View specific container logs
docker-compose logs -f app
docker-compose logs -f db

# View Laravel logs inside container
docker exec todo-app tail -f storage/logs/laravel.log
```

### Database Operations

```bash
# Backup database
docker exec todo-db mysqldump -u todo_user -ptodo_password todo_list > backup.sql

# Restore database
docker exec -i todo-db mysql -u todo_user -ptodo_password todo_list < backup.sql

# Access MySQL CLI
docker exec -it todo-db mysql -u todo_user -ptodo_password todo_list
```

## Environment Variables

The `docker-compose.yml` file sets default environment variables. For production, create a `.env` file or modify the environment section in `docker-compose.yml`.

Key variables:
- `DB_HOST=db` (container name)
- `DB_DATABASE=todo_list`
- `DB_USERNAME=todo_user`
- `DB_PASSWORD=todo_password`

## Development Workflow

### Hot Reload (Development)

For development with hot reload, you can run Vite outside Docker:

```bash
# On your host machine
npm install
npm run dev
```

Then access the app at http://localhost:8000 (served by Docker) while Vite runs on port 5173.

### Building for Production

The Dockerfile includes production-optimized settings. To deploy:

```bash
# Build production image
docker build -t todo-list-app:prod .

# Or use docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Permission Issues

```bash
# Fix storage and cache permissions
docker exec todo-app chmod -R 775 storage bootstrap/cache
docker exec todo-app chown -R www-data:www-data storage bootstrap/cache
```

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View error logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

Ensure the app container waits for the database to be ready:

```bash
# Check database is running
docker-compose ps db

# Test database connection
docker exec todo-app php artisan tinker
# In tinker: DB::connection()->getPdo();
```

## Clean Up

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove images
docker rmi todo-list-app

# Remove all unused Docker resources
docker system prune -a --volumes
```

## Production Considerations

For production deployment:

1. Use environment-specific `.env` files
2. Set `APP_DEBUG=false`
3. Use proper secrets management (Docker secrets, env variables)
4. Configure SSL/TLS termination
5. Use production-grade reverse proxy (Nginx, Traefik)
6. Set up proper logging and monitoring
7. Configure automated backups
8. Use health checks in docker-compose
9. Consider using Docker Swarm or Kubernetes for orchestration

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Laravel Docker Best Practices](https://laravel.com/docs/deployment)
- [Docker Compose Reference](https://docs.docker.com/compose/)
