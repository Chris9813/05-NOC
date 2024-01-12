-- CreateEnum
CREATE TYPE "SaverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "LogMode" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "level" "SaverityLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogMode_pkey" PRIMARY KEY ("id")
);
