# Real Estate Investment Analysis Platform

A comprehensive web application for real estate investors to analyze properties, manage portfolios, and simulate investment scenarios with advanced financial modeling and predictive analytics.

## 🏡 Features

### Portfolio Management
- Track unlimited properties across multiple portfolios
- Support for residential, commercial, and mixed-use properties
- Living vs rental property classification
- Property performance analytics and comparisons
- Geographic distribution analysis

### Financial Analysis
- **Key Metrics**: Cap rate, cash flow, ROI, IRR, cash-on-cash return
- **Advanced Simulations**: Monte Carlo analysis, scenario modeling
- **Sensitivity Analysis**: Rent changes, market conditions, expenses
- **Portfolio Analytics**: Diversification insights, aggregate performance
- **Investment Comparisons**: Side-by-side property analysis

### Data Management
- Import properties from CSV/Excel files
- Integration with external property APIs
- Data validation and error handling
- Automated property valuation updates
- Bulk property operations

### User Experience
- Responsive React frontend with TypeScript
- Interactive charts and visualizations (Recharts)
- Mobile-optimized interface
- Real-time calculations and updates
- Modern, commercial-grade UI design

### Future Features
- ML-powered rent estimation
- Market trend analysis and predictions
- Investment opportunity scoring
- Mobile app (React Native)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for state management
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Python 3.11+** with FastAPI
- **SQLAlchemy** ORM with PostgreSQL
- **Alembic** for database migrations
- **Pydantic** for data validation
- **JWT** authentication
- **Redis** for caching
- **Pandas/NumPy** for data processing

### Infrastructure
- **Docker** containerization
- **PostgreSQL** database
- **Redis** caching layer
- **GitHub Actions** CI/CD
- **Vercel** (frontend deployment)
- **Railway** (backend deployment)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis (optional for development)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/real-estate-platform.git
cd real-estate-platform

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Edit .env with your database credentials

# Database setup
alembic upgrade head

# Run the server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Frontend setup (new terminal)
cd frontend
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your API URL

# Run the development server
npm start
```

### Docker Setup (Alternative)

```bash
# Run entire stack with Docker
docker-compose up -d

# The app will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 📁 Project Structure

```
real-estate-platform/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Configuration, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   ├── migrations/        # Alembic migrations
│   ├── tests/             # Test suites
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API calls
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Helper functions
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by FastAPI's automatic OpenAPI generation.

### Key Endpoints

```
Authentication:
POST   /auth/register
POST   /auth/login
POST   /auth/refresh

Properties:
GET    /properties/
POST   /properties/
GET    /properties/{id}
PUT    /properties/{id}
DELETE /properties/{id}

Financial Analysis:
GET    /properties/{id}/metrics
POST   /properties/{id}/simulate
POST   /properties/compare

Portfolios:
GET    /portfolios/
POST   /portfolios/
GET    /portfolios/{id}/analytics

Data Import:
POST   /import/csv
GET    /import/{session_id}/status
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Simple Deployment (Vercel + Railway)

#### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set `REACT_APP_API_URL` environment variable
3. Deploy automatically on git push

### Production Deployment (AWS)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed AWS deployment instructions including:
- ECS Fargate setup
- RDS PostgreSQL configuration
- S3 + CloudFront setup
- CI/CD pipeline configuration

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- SQL injection prevention
- Rate limiting
- CORS configuration
- Environment-based secrets management

## 📊 Financial Calculations

The platform includes sophisticated financial modeling:

### Core Metrics
- **Cap Rate**: Net Operating Income / Property Value
- **Cash Flow**: Monthly Income - Monthly Expenses
- **Cash-on-Cash Return**: Annual Cash Flow / Initial Investment
- **ROI**: (Gain - Initial Investment) / Initial Investment
- **IRR**: Internal Rate of Return calculation

### Advanced Analysis
- Monte Carlo simulations for risk assessment
- Sensitivity analysis for key variables
- Portfolio optimization suggestions
- Market trend incorporation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python type hints
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic property management
- [x] Financial calculations
- [x] User authentication
- [x] Portfolio analytics

### Phase 2 (Next)
- [ ] Data import/export
- [ ] Advanced simulations
- [ ] Mobile responsive design
- [ ] API integrations

### Phase 3 (Future)
- [ ] ML rent prediction
- [ ] Market analysis
- [ ] Mobile app (React Native)
- [ ] Advanced reporting

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/real-estate-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/real-estate-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/real-estate-platform/discussions)

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [React](https://reactjs.org/) and the React ecosystem
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Recharts](https://recharts.org/) for beautiful data visualizations

---
