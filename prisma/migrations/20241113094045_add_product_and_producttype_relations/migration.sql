-- CreateTable
CREATE TABLE "product_tb" (
    "product_id" SERIAL NOT NULL,
    "images" TEXT,
    "name" TEXT NOT NULL,
    "product_type_id" INTEGER NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "cost_price" DOUBLE PRECISION NOT NULL,
    "status_id" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "product_tb_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "product_tb" ADD CONSTRAINT "product_tb_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_type_tb"("producttype_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tb" ADD CONSTRAINT "product_tb_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;
