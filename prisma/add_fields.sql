-- Add missing fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;

-- Add missing fields to Merchandise table  
ALTER TABLE "Merchandise" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT '{}';
ALTER TABLE "Merchandise" ADD COLUMN IF NOT EXISTS "inventory" INTEGER DEFAULT 0;
ALTER TABLE "Merchandise" ADD COLUMN IF NOT EXISTS "deliveryRadius" DOUBLE PRECISION;

-- Create ProductCategory enum
DO $$ BEGIN
    CREATE TYPE "ProductCategory" AS ENUM ('PHYSICAL', 'DIGITAL', 'SOFTWARE', 'HARDWARE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create ProductCondition enum
DO $$ BEGIN
    CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Migrate existing type field to category enum
ALTER TABLE "Merchandise" ADD COLUMN IF NOT EXISTS "category" "ProductCategory";
UPDATE "Merchandise" SET "category" = 
    CASE 
        WHEN "type" = 'physical' THEN 'PHYSICAL'::"ProductCategory"
        WHEN "type" = 'digital' THEN 'DIGITAL'::"ProductCategory"
        ELSE 'PHYSICAL'::"ProductCategory"
    END
WHERE "category" IS NULL;

-- Add condition field
ALTER TABLE "Merchandise" ADD COLUMN IF NOT EXISTS "condition" "ProductCondition" DEFAULT 'NEW';

-- Drop old type field after migration
ALTER TABLE "Merchandise" DROP COLUMN IF EXISTS "type";
