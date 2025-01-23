/*
  Warnings:

  - You are about to drop the `tabla_presupuesto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "tabla_presupuesto";

-- CreateTable
CREATE TABLE "TablaPresupuesto" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoría" TEXT NOT NULL,
    "subcategoría" TEXT,
    "item" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripción" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TablaPresupuesto_pkey" PRIMARY KEY ("id")
);
