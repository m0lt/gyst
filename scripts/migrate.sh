#!/bin/bash
# Simple migration script using psql
# This connects directly to Supabase PostgreSQL

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Supabase Migration Runner${NC}\n"

# Check for .env
if [ ! -f .env ]; then
  echo -e "${RED}❌ .env file not found${NC}"
  exit 1
fi

# Load environment variables
source .env

# Check for required variables
if [ -z "$SUPABASE_DB_URL" ]; then
  echo -e "${RED}❌ SUPABASE_DB_URL not found in .env${NC}"
  echo -e "${YELLOW}💡 Add this to your .env:${NC}"
  echo -e "   SUPABASE_DB_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
  echo ""
  echo -e "${YELLOW}Find it at:${NC} https://supabase.com/dashboard/project/fjfswufsvfdrrotvmajv/settings/database"
  exit 1
fi

# Find migration files
MIGRATIONS_DIR="supabase/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo -e "${RED}❌ Migrations directory not found: $MIGRATIONS_DIR${NC}"
  exit 1
fi

# Count migrations
MIGRATION_COUNT=$(find "$MIGRATIONS_DIR" -name "*.sql" | wc -l)
if [ "$MIGRATION_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No migration files found${NC}"
  exit 0
fi

echo -e "${GREEN}Found $MIGRATION_COUNT migration file(s)${NC}\n"

# Run each migration
for migration in $(find "$MIGRATIONS_DIR" -name "*.sql" | sort); do
  filename=$(basename "$migration")
  echo -e "${YELLOW}📄 Running: $filename${NC}"

  if /opt/homebrew/opt/postgresql@17/bin/psql "$SUPABASE_DB_URL" -f "$migration"; then
    echo -e "${GREEN}✅ Success${NC}\n"
  else
    echo -e "${RED}❌ Failed${NC}\n"
    exit 1
  fi
done

echo -e "${GREEN}🎉 All migrations completed successfully!${NC}"
