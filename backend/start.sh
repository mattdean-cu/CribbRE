#!/bin/bash
# start.sh - Startup script for Railway

set -e  # Exit on error

echo "🔄 Running database migrations..."
alembic upgrade head

echo "🚀 Starting Gunicorn server..."
exec gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    --access-logfile - \
    --error-logfile -