"""add_parent_id_to_portfolios

Revision ID: 64270bd13aba
Revises: f640d1b8ea50
Create Date: 2025-09-30 00:32:56.755543

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '64270bd13aba'
down_revision = 'f640d1b8ea50'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('portfolios', sa.Column('parent_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_portfolios_parent_id', 'portfolios', 'portfolios', ['parent_id'], ['id'])

def downgrade():
    op.drop_constraint('fk_portfolios_parent_id', 'portfolios', type_='foreignkey')
    op.drop_column('portfolios', 'parent_id')