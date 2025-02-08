#!/bin/sh

echo "Waiting for database to be ready..."
until nc -z -v -w30 "$DATABASE_HOST" 5432
do
  echo "Waiting for database connection..."
  sleep 5
done

echo "Database is ready! Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node build/server.js
