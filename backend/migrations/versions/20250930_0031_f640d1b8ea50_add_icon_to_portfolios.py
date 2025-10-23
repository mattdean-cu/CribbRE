"""add_icon_to_portfolios

Revision ID: f640d1b8ea50
Revises: ea5b51799104
Create Date: 2025-09-30 00:31:14.005705

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f640d1b8ea50'
down_revision = 'ea5b51799104'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('portfolios', sa.Column('icon', sa.String(length=50), nullable=True))

def downgrade():
    op.drop_column('portfolios', 'icon')