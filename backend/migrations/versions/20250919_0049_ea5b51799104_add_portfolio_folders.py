"""add_portfolio_folders

Revision ID: ea5b51799104
Revises: bc520b609af4
Create Date: 2025-09-19 00:49:16.556420

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'ea5b51799104'
down_revision = 'bc520b609af4'
branch_labels = None
depends_on = None


def upgrade():
    # Only add portfolio_id column to properties table (portfolios table already exists)
    op.add_column('properties', sa.Column('portfolio_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_properties_portfolio_id', 'properties', 'portfolios', ['portfolio_id'], ['id'])

def downgrade():
    # Remove portfolio_id column from properties
    op.drop_constraint('fk_properties_portfolio_id', 'properties', type_='foreignkey')
    op.drop_column('properties', 'portfolio_id')