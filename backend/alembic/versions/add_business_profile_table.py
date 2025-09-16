"""Add business profile table

Revision ID: add_business_profile
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_business_profile'
down_revision = None  # Update this with the latest revision ID
branch_labels = None
depends_on = None


def upgrade():
    # Create business_profiles table
    op.create_table('business_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('business_name', sa.String(length=255), nullable=True),
        sa.Column('business_type', sa.String(length=100), nullable=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('business_description', sa.Text(), nullable=True),
        sa.Column('brand_personality', sa.String(length=100), nullable=True),
        sa.Column('target_audience', sa.String(length=255), nullable=True),
        sa.Column('communication_tone', sa.String(length=100), nullable=True),
        sa.Column('preferred_language', sa.String(length=50), nullable=True),
        sa.Column('response_style', sa.String(length=100), nullable=True),
        sa.Column('business_hours', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('typical_customer_questions', sa.Text(), nullable=True),
        sa.Column('common_issues', sa.Text(), nullable=True),
        sa.Column('special_offers', sa.Text(), nullable=True),
        sa.Column('greeting_style', sa.String(length=255), nullable=True),
        sa.Column('closing_style', sa.String(length=255), nullable=True),
        sa.Column('use_emojis', sa.Boolean(), nullable=True, default=True),
        sa.Column('mention_business_name', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_completed', sa.Boolean(), nullable=False, default=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_business_profiles_id'), 'business_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_business_profiles_user_id'), 'business_profiles', ['user_id'], unique=True)
    
    # Create foreign key constraint
    op.create_foreign_key(None, 'business_profiles', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade():
    # Drop foreign key constraint
    op.drop_constraint(None, 'business_profiles', type_='foreignkey')
    
    # Drop indexes
    op.drop_index(op.f('ix_business_profiles_user_id'), table_name='business_profiles')
    op.drop_index(op.f('ix_business_profiles_id'), table_name='business_profiles')
    
    # Drop table
    op.drop_table('business_profiles')
