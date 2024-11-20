-- CreateTable
CREATE TABLE "Promotions" (
    "promo_id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "proimage" TEXT NOT NULL,
    "promo_name" VARCHAR(255) NOT NULL,
    "promo_type" INTEGER NOT NULL,
    "promo_dec" TEXT NOT NULL,
    "amountuse" INTEGER NOT NULL,
    "amountgiven" INTEGER NOT NULL,
    "valuegiven_id" INTEGER NOT NULL,
    "amountcon" INTEGER NOT NULL,
    "valuecon_id" INTEGER NOT NULL,
    "startdate" VARCHAR(255) NOT NULL,
    "enddate" VARCHAR(255) NOT NULL,
    "thtime" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("promo_id")
);

-- CreateTable
CREATE TABLE "PromotionType" (
    "promo_type_id" SERIAL NOT NULL,
    "promo_type_name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "PromotionType_pkey" PRIMARY KEY ("promo_type_id")
);

-- AddForeignKey
ALTER TABLE "Promotions" ADD CONSTRAINT "Promotions_promo_type_fkey" FOREIGN KEY ("promo_type") REFERENCES "PromotionType"("promo_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
