/*
  Warnings:

  - The `submncondt` column on the `product_type_tb` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "product_type_tb" DROP COLUMN "submncondt",
ADD COLUMN     "submncondt" INTEGER;
