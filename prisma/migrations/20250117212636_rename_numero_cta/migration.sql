/*
  Warnings:

  - Added the required column `NUMERO CTA` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "NUMERO CTA" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "glosa" TEXT,
ADD COLUMN     "t" TEXT;

-- CreateTable
CREATE TABLE "chathistory" (
    "id" SERIAL NOT NULL,
    "thread_id" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chathistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);
