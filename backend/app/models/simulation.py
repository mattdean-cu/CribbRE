from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Simulation(Base):
    """
    Simulation model for storing scenario analysis and Monte Carlo simulations
    """
    __tablename__ = "simulations"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False, index=True)

    # Simulation information
    name = Column(String(255), nullable=False)
    simulation_type = Column(String(50), nullable=False)  # "scenario", "monte_carlo"
    description = Column(Text)

    # Simulation parameters (stored as JSON for flexibility)
    parameters = Column(JSON)  # Rent growth, appreciation, etc.

    # Simulation results (stored as JSON)
    results = Column(JSON)  # All calculation results

    # Summary metrics
    years_projected = Column(Integer, default=10)
    total_return = Column(Float)
    annual_return = Column(Float)
    final_property_value = Column(Float)
    total_cash_flow = Column(Float)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="simulations")
    property = relationship("Property")

    def __repr__(self):
        return f"<Simulation(id={self.id}, name={self.name}, type={self.simulation_type})>"