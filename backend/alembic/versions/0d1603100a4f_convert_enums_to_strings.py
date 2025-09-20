"""convert_enums_to_strings

Revision ID: 0d1603100a4f
Revises: 004_add_subscription_tables
Create Date: 2025-09-20 23:32:42.533491

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d1603100a4f'
down_revision = '004_add_subscription_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Convert enum columns to string columns to avoid enum conversion issues

    # Convert plan_type from enum to string
    op.alter_column('plans', 'plan_type',
                    existing_type=sa.Enum('starter', 'growth', 'pro', name='plantype'),
                    type_=sa.String(),
                    existing_nullable=False)

    # Convert subscription status from enum to string
    op.alter_column('subscriptions', 'status',
                    existing_type=sa.Enum('active', 'cancelled', 'expired', 'pending', name='subscriptionstatus'),
                    type_=sa.String(),
                    existing_nullable=True)

    # Convert payment status from enum to string
    op.alter_column('payments', 'status',
                    existing_type=sa.Enum('pending', 'completed', 'failed', 'refunded', name='paymentstatus'),
                    type_=sa.String(),
                    existing_nullable=True)


def downgrade() -> None:
    # Revert string columns back to enum columns

    # Revert payment status to enum
    op.alter_column('payments', 'status',
                    existing_type=sa.String(),
                    type_=sa.Enum('pending', 'completed', 'failed', 'refunded', name='paymentstatus'),
                    existing_nullable=True)

    # Revert subscription status to enum
    op.alter_column('subscriptions', 'status',
                    existing_type=sa.String(),
                    type_=sa.Enum('active', 'cancelled', 'expired', 'pending', name='subscriptionstatus'),
                    existing_nullable=True)

    # Revert plan_type to enum
    op.alter_column('plans', 'plan_type',
                    existing_type=sa.String(),
                    type_=sa.Enum('starter', 'growth', 'pro', name='plantype'),
                    existing_nullable=False)
