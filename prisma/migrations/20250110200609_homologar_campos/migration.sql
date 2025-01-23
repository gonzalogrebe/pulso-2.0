/*
  Warnings:

  - You are about to drop the column `amount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `date` to the `TablaPresupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoría` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TablaPresupuesto" ADD COLUMN     "date" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "subcategory",
DROP COLUMN "type",
ADD COLUMN     "categoría" TEXT NOT NULL,
ADD COLUMN     "descripción" TEXT,
ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subcategoría" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "item" SET DATA TYPE TEXT;
