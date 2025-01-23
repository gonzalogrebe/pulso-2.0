/*
  Warnings:

  - The primary key for the `TablaPresupuesto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoría` on the `TablaPresupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `descripción` on the `TablaPresupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoría` on the `TablaPresupuesto` table. All the data in the column will be lost.
  - The `id` column on the `TablaPresupuesto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `TablaPresupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TablaPresupuesto" DROP CONSTRAINT "TablaPresupuesto_pkey",
DROP COLUMN "categoría",
DROP COLUMN "descripción",
DROP COLUMN "subcategoría",
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "subcategoria" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "TablaPresupuesto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "transactions";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TIMESTAMP(6) NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "item" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "provider_client" VARCHAR(200),
    "payment_method" VARCHAR(50),
    "reference" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
