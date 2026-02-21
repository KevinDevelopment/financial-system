#!/bin/sh
set -e

DB_USER=$(cat /run/secrets/postgres_user)

echo "⏳ Aguardando Postgres..."
until pg_isready -h postgres -p 5432 -U "$DB_USER"; do
  sleep 2
done

echo "🚀 Rodando migrations..."
npx prisma migrate deploy

echo "🌱 Rodando seed..."
npx prisma db seed

echo "🔥 Subindo aplicação..."
exec node dist/src/presentation/web/server.js