# test-api.ps1
# Simple test script for Property API

Write-Host "Testing Property API..." -ForegroundColor Green

# Login
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginData = '{"email": "test@example.com", "password": "password123"}'
$loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $loginData
$token = $loginResponse.access_token
Write-Host "Login successful!" -ForegroundColor Green

# Create property
Write-Host "2. Creating property..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$propertyJson = @"
{
    "name": "Test Property",
    "address": "123 Test Street",
    "property_type": "residential",
    "purchase_price": 300000,
    "current_value": 320000,
    "monthly_rent": 2500,
    "monthly_expenses": 800,
    "down_payment": 60000,
    "bedrooms": 3,
    "bathrooms": 2,
    "square_footage": 1200
}
"@

$propertyResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/v1/properties/" -Method Post -Headers $headers -Body $propertyJson
Write-Host "Property created! ID: $($propertyResponse.id)" -ForegroundColor Green

# Show results
Write-Host "3. Property Details:" -ForegroundColor Yellow
$propertyResponse | ConvertTo-Json -Depth 10

Write-Host "Testing complete!" -ForegroundColor Green