"""Add subscription tables

Revision ID: 004_add_subscription_tables
Revises: 003_add_business_profile
Create Date: 2024-01-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '004_add_subscription_tables'
down_revision = '9a8b7c6d5e4f'
branch_labels = None
depends_on = None

def upgrade():
    # Use raw SQL to create enums and tables to avoid SQLAlchemy auto-creation issues
    connection = op.get_bind()

    # Create enum types if they don't exist
    connection.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE plantype AS ENUM ('starter', 'growth', 'pro');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))

    connection.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE subscriptionstatus AS ENUM ('active', 'cancelled', 'expired', 'pending');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))

    connection.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE paymentstatus AS ENUM ('pending', 'completed', 'failed', 'refunded');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))

    # Create plans table
    op.create_table('plans',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('plan_type', postgresql.ENUM('starter', 'growth', 'pro', name='plantype', create_type=False), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('monthly_messages', sa.Integer(), nullable=False),
        sa.Column('instagram_accounts', sa.Integer(), nullable=False),
        sa.Column('basic_faq', sa.Boolean(), nullable=True),
        sa.Column('analytics', sa.Boolean(), nullable=True),
        sa.Column('advanced_analytics', sa.Boolean(), nullable=True),
        sa.Column('team_handoff', sa.Boolean(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plans_id'), 'plans', ['id'], unique=False)

    # Create subscriptions table
    op.create_table('subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('plan_id', sa.Integer(), nullable=False),
        sa.Column('razorpay_subscription_id', sa.String(), nullable=True),
        sa.Column('razorpay_plan_id', sa.String(), nullable=True),
        sa.Column('status', postgresql.ENUM('active', 'cancelled', 'expired', 'pending', name='subscriptionstatus', create_type=False), nullable=True),
        sa.Column('start_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('end_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('next_billing_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('messages_used_this_month', sa.Integer(), nullable=True),
        sa.Column('last_usage_reset', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancellation_reason', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('razorpay_subscription_id')
    )
    op.create_index(op.f('ix_subscriptions_id'), 'subscriptions', ['id'], unique=False)

    # Create payments table
    op.create_table('payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('subscription_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('razorpay_payment_id', sa.String(), nullable=True),
        sa.Column('razorpay_order_id', sa.String(), nullable=True),
        sa.Column('razorpay_signature', sa.String(), nullable=True),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('status', postgresql.ENUM('pending', 'completed', 'failed', 'refunded', name='paymentstatus', create_type=False), nullable=True),
        sa.Column('billing_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('billing_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('payment_method', sa.String(), nullable=True),
        sa.Column('failure_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['subscription_id'], ['subscriptions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('razorpay_payment_id')
    )
    op.create_index(op.f('ix_payments_id'), 'payments', ['id'], unique=False)

    # Insert default plans
    op.execute("""
        INSERT INTO plans (name, plan_type, price, currency, monthly_messages, instagram_accounts, basic_faq, analytics, advanced_analytics, team_handoff, description, is_active) VALUES
        ('Starter', 'starter', 499.0, 'INR', 200, 1, true, false, false, false, 'Up to 200 auto-replies/month, 1 Instagram account, Basic FAQ setup', true),
        ('Growth', 'growth', 999.0, 'INR', 1000, 1, true, true, false, false, 'Up to 1,000 auto-replies/month, 1 Instagram account, FAQ setup + basic analytics', true),
        ('Pro', 'pro', 2999.0, 'INR', 5000, 3, true, true, true, true, 'Up to 5,000 auto-replies/month, Up to 3 Instagram accounts, Advanced analytics + team handoff', true)
    """)

def downgrade():
    # Drop tables
    op.drop_index(op.f('ix_payments_id'), table_name='payments')
    op.drop_table('payments')
    op.drop_index(op.f('ix_subscriptions_id'), table_name='subscriptions')
    op.drop_table('subscriptions')
    op.drop_index(op.f('ix_plans_id'), table_name='plans')
    op.drop_table('plans')
    
    # Drop enum types
    payment_status_enum = postgresql.ENUM('pending', 'completed', 'failed', 'refunded', name='paymentstatus')
    payment_status_enum.drop(op.get_bind())
    
    subscription_status_enum = postgresql.ENUM('active', 'cancelled', 'expired', 'pending', name='subscriptionstatus')
    subscription_status_enum.drop(op.get_bind())
    
    plan_type_enum = postgresql.ENUM('starter', 'growth', 'pro', name='plantype')
    plan_type_enum.drop(op.get_bind())
