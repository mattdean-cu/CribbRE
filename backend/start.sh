#!/bin/bash
# start.sh - Startup script for Railway
# Place this in /backend folder

set -e  # Exit on error

echo "🔄 Running database migrations..."
alembic upgrade head

echo "🚀 Starting Gunicorn server..."
echo "📍 PORT is set to: ${PORT:-8000}"

# Use PORT from environment, fallback to 8000
PORT=${PORT:-8000}

exec gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:${PORT} \
    --access-logfile - \
    --error-logfile -