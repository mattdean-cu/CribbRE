"""add_is_default_to_portfolios

Revision ID: 8593bee96dcf
Revises: 64270bd13aba
Create Date: 2025-09-30 00:34:25.100416

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8593bee96dcf'
down_revision = '64270bd13aba'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('portfolios', sa.Column('is_default', sa.Boolean(), nullable=True))

def downgrade():
    op.drop_column('portfolios', 'is_default')