"""add_is_incoming_to_messages

Revision ID: f0968c42c15c
Revises: 5adfa4246778
Create Date: 2025-08-22 00:07:18.488469

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0968c42c15c'
down_revision = '5adfa4246778'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_incoming column to messages table
    op.add_column('messages', sa.Column('is_incoming', sa.Boolean(), nullable=True))

    # Set default value for existing records (all existing messages should be incoming)
    op.execute("UPDATE messages SET is_incoming = true WHERE is_incoming IS NULL")

    # Make the column non-nullable after setting default values
    op.alter_column('messages', 'is_incoming', nullable=False, server_default=sa.text('true'))


def downgrade() -> None:
    # Remove is_incoming column
    op.drop_column('messages', 'is_incoming')
