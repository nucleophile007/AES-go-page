-- CreateTable
CREATE TABLE "public"."AvailabilityDay" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "times" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityDay_date_key" ON "public"."AvailabilityDay"("date");
