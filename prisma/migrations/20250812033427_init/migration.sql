-- CreateTable
CREATE TABLE "public"."WebinarRegistration" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebinarRegistration_pkey" PRIMARY KEY ("id")
);
