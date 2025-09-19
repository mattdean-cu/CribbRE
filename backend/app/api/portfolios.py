# backend/app/api/portfolios.py
# Portfolio (folder) management API endpoints

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.service import get_current_user
from app.models.user import User
from app.services.portfolio_service import PortfolioService
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse, PortfolioWithMetrics

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio(
        portfolio_data: PortfolioCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Create a new portfolio folder"""
    portfolio_service = PortfolioService(db)

    try:
        portfolio = portfolio_service.create_portfolio(
            portfolio_data.model_dump(),
            current_user.id
        )
        return portfolio
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating portfolio: {str(e)}"
        )


@router.get("/", response_model=List[PortfolioWithMetrics])
async def get_user_portfolios(
        include_default: bool = True,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get all portfolio folders for the current user with metrics"""
    portfolio_service = PortfolioService(db)
    return portfolio_service.get_user_portfolios_with_metrics(current_user.id, include_default)


@router.get("/{portfolio_id}", response_model=PortfolioWithMetrics)
async def get_portfolio(
        portfolio_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get a specific portfolio folder by ID with metrics"""
    portfolio_service = PortfolioService(db)
    portfolio = portfolio_service.get_portfolio_with_metrics(portfolio_id, current_user.id)

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )

    return portfolio


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
        portfolio_id: int,
        portfolio_data: PortfolioUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Update a portfolio folder"""
    portfolio_service = PortfolioService(db)

    # Filter out None values from update data
    update_data = {k: v for k, v in portfolio_data.model_dump().items() if v is not None}

    portfolio = portfolio_service.update_portfolio(
        portfolio_id,
        current_user.id,
        update_data
    )

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )

    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
        portfolio_id: int,
        move_properties_to: Optional[int] = None,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Delete a portfolio folder

    Args:
        portfolio_id: ID of portfolio to delete
        move_properties_to: Optional portfolio ID to move properties to before deletion
    """
    portfolio_service = PortfolioService(db)

    success = portfolio_service.delete_portfolio(
        portfolio_id,
        current_user.id,
        move_properties_to
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )

    return None


@router.post("/{portfolio_id}/properties/{property_id}")
async def move_property_to_portfolio(
        portfolio_id: int,
        property_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Move a property to a different portfolio folder"""
    portfolio_service = PortfolioService(db)

    success = portfolio_service.move_property_to_portfolio(
        property_id,
        portfolio_id,
        current_user.id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property or portfolio not found"
        )

    return {"message": "Property moved successfully"}


@router.get("/{portfolio_id}/properties")
async def get_portfolio_properties(
        portfolio_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get all properties in a specific portfolio folder"""
    portfolio_service = PortfolioService(db)
    properties = portfolio_service.get_portfolio_properties(portfolio_id, current_user.id)

    if properties is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )

    return properties


@router.post("/initialize")
async def initialize_default_portfolio(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Create default 'All Properties' portfolio and move existing properties to it"""
    portfolio_service = PortfolioService(db)

    default_portfolio = portfolio_service.initialize_default_portfolio(current_user.id)

    return {
        "message": "Default portfolio initialized",
        "portfolio": default_portfolio
    }


@router.get("/{portfolio_id}/metrics")
async def get_portfolio_metrics(
        portfolio_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get detailed financial metrics for a portfolio folder"""
    portfolio_service = PortfolioService(db)
    metrics = portfolio_service.calculate_portfolio_metrics(portfolio_id, current_user.id)

    if not metrics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )

    return metrics