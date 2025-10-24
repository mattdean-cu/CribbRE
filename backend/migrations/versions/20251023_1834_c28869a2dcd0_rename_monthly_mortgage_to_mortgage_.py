"""rename monthly_mortgage to mortgage_payment

Revision ID: c28869a2dcd0
Revises: 7c76f52ecbfc
Create Date: 2025-10-23 18:34:25.165744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c28869a2dcd0'
down_revision = '7c76f52ecbfc'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('property_financials', 'monthly_mortgage', new_column_name='mortgage_payment')

def downgrade():
    op.alter_column('property_financials', 'mortgage_payment', new_column_name='monthly_mortgage')