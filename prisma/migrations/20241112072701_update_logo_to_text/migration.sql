-- AlterTable
ALTER TABLE "users" ALTER COLUMN "referred_by" DROP NOT NULL;

-- CreateTable
CREATE TABLE "stores" (
    "storeId" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "logo" TEXT,
    "storeName" TEXT NOT NULL,
    "storeType" INTEGER NOT NULL,
    "storeDes" TEXT,
    "style" INTEGER NOT NULL,
    "province" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" INTEGER NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("storeId")
);

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
