/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TIMESTAMP(6) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "subcategory" VARCHAR(100),
    "item" VARCHAR(100),
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "provider_client" VARCHAR(200),
    "payment_method" VARCHAR(50),
    "reference" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabla_presupuesto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo" VARCHAR(50) NOT NULL,
    "categoría" VARCHAR(100) NOT NULL,
    "subcategoría" VARCHAR(100),
    "item" VARCHAR(100),
    "monto" DECIMAL(15,2) NOT NULL,
    "descripción" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tabla_presupuesto_pkey" PRIMARY KEY ("id")
);
