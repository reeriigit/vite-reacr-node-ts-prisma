-- CreateTable
CREATE TABLE "product_type_tb" (
    "producttype_id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "producttype_name" TEXT NOT NULL,
    "producttype_image" TEXT,
    "description" TEXT,
    "submncondt" TEXT,

    CONSTRAINT "product_type_tb_pkey" PRIMARY KEY ("producttype_id")
);

-- AddForeignKey
ALTER TABLE "product_type_tb" ADD CONSTRAINT "product_type_tb_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;
