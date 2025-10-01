# app/api/properties.py
# Property management API endpoints

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.service import get_current_user
from app.models.user import User
from app.services.property_service import PropertyService
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse

router = APIRouter(prefix="/properties", tags=["properties"])


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
        property_data: PropertyCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Create a new property with automatic financial calculations"""
    print(f"DEBUG: Received property data: {property_data.model_dump()}")
    property_service = PropertyService(db)

    try:
        property_obj = property_service.create_property(
            property_data.model_dump(),
            current_user.id
        )
        print(f"DEBUG: Property created successfully with ID: {property_obj.id}")
        return property_obj
    except Exception as e:
        print(f"DEBUG: Error creating property: {str(e)}")
        print(f"DEBUG: Error type: {type(e)}")
        import traceback
        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating property: {str(e)}"
        )


@router.get("/", response_model=List[PropertyResponse])
async def get_user_properties(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get all properties for the current user"""
    property_service = PropertyService(db)
    return property_service.get_user_properties(current_user.id)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
        property_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get a specific property by ID"""
    property_service = PropertyService(db)
    property_obj = property_service.get_property_by_id(property_id, current_user.id)

    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    return property_obj


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
        property_id: int,
        property_data: PropertyUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Update a property and recalculate financial metrics"""
    property_service = PropertyService(db)

    # Filter out None values from update data
    # Special handling for portfolio_id to allow setting it to None
    update_dict = property_data.model_dump(exclude_unset=True)

    # Filter out None values EXCEPT for portfolio_id
    update_data = {}
    for k, v in update_dict.items():
        if k == 'portfolio_id':
            update_data[k] = v  # Keep portfolio_id even if None
        elif v is not None:
            update_data[k] = v

    property_obj = property_service.update_property(
        property_id,
        current_user.id,
        update_data
    )

    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    return property_obj


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
        property_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Delete a property"""
    property_service = PropertyService(db)

    success = property_service.delete_property(property_id, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    return None


@router.get("/{property_id}/metrics")
async def get_property_metrics(
        property_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get detailed financial metrics for a property"""
    property_service = PropertyService(db)
    property_obj = property_service.get_property_by_id(property_id, current_user.id)

    if not property_obj or not property_obj.financials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property or financial data not found"
        )

    # Return detailed metrics calculated by Python
    return {
        "property_id": property_id,
        "monthly_cash_flow": property_obj.financials.cash_flow,
        "annual_cash_flow": property_obj.financials.cash_flow * 12,
        "cap_rate": property_obj.financials.cap_rate,
        "roi": property_obj.financials.roi,
        "monthly_rent": property_obj.financials.monthly_rent,
        "monthly_expenses": property_obj.financials.monthly_expenses,
        "vacancy_rate": property_obj.financials.vacancy_rate,
        "property_value": property_obj.current_value
    }