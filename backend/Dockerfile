# Dockerfile
# Place this in /backend folder

FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Expose port (Railway will override with $PORT environment variable)
EXPOSE 8000

# Run the startup script (includes migrations + gunicorn)
CMD ["./start.sh"]