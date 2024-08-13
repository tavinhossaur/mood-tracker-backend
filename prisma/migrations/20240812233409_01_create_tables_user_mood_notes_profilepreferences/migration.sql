-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "streak" JSON,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_preferences_id" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" UUID NOT NULL,
    "mood_value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" UUID NOT NULL,
    "text_content" TEXT NOT NULL,
    "mood_id" UUID NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePreferences" (
    "id" UUID NOT NULL,
    "profile_img" BYTEA,

    CONSTRAINT "ProfilePreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_profile_preferences_id_key" ON "User"("profile_preferences_id");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_mood_id_key" ON "Notes"("mood_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profile_preferences_id_fkey" FOREIGN KEY ("profile_preferences_id") REFERENCES "ProfilePreferences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_mood_id_fkey" FOREIGN KEY ("mood_id") REFERENCES "Mood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
