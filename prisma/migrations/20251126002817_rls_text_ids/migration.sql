-- -------------------------------
-- Step 1: Convert UUID columns to TEXT
-- -------------------------------
ALTER TABLE "public"."User" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Session" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Session" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."VerificationRequest" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."VerificationRequest" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Track" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Track" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Playlist" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Playlist" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Order" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Order" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."OrderItem" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."OrderItem" ALTER COLUMN "orderId" TYPE text USING "orderId"::text;

ALTER TABLE "public"."OrderItem" ALTER COLUMN "trackId" TYPE text USING "trackId"::text;

ALTER TABLE "public"."Notification" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Notification" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Message" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Message" ALTER COLUMN "senderId" TYPE text USING "senderId"::text;

ALTER TABLE "public"."Message" ALTER COLUMN "recipientId" TYPE text USING "recipientId"::text;

ALTER TABLE "public"."Comment" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Comment" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Comment" ALTER COLUMN "trackId" TYPE text USING "trackId"::text;

ALTER TABLE "public"."Like" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Like" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Like" ALTER COLUMN "trackId" TYPE text USING "trackId"::text;

ALTER TABLE "public"."Follow" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Follow" ALTER COLUMN "followerId" TYPE text USING "followerId"::text;

ALTER TABLE "public"."Follow" ALTER COLUMN "followingId" TYPE text USING "followingId"::text;

ALTER TABLE "public"."Report" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Report" ALTER COLUMN "reporterId" TYPE text USING "reporterId"::text;

ALTER TABLE "public"."Report" ALTER COLUMN "reportedId" TYPE text USING "reportedId"::text;

ALTER TABLE "public"."ApiKey" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."ApiKey" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Transaction" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Transaction" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."Account" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Account" ALTER COLUMN "userId" TYPE text USING "userId"::text;

ALTER TABLE "public"."PlaylistTrack" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."PlaylistTrack" ALTER COLUMN "playlistId" TYPE text USING "playlistId"::text;

ALTER TABLE "public"."PlaylistTrack" ALTER COLUMN "trackId" TYPE text USING "trackId"::text;

ALTER TABLE "public"."Analytics" ALTER COLUMN "id" TYPE text USING "id"::text;

ALTER TABLE "public"."Analytics" ALTER COLUMN "userId" TYPE text USING "userId"::text;

-- -------------------------------
-- Step 2: Enable Row-Level Security (RLS)
-- -------------------------------
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Session" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."VerificationRequest" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Track" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Playlist" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."PlaylistTrack" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Notification" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Order" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."OrderItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Transaction" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Message" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Comment" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Like" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Follow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Report" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ApiKey" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Analytics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Account" ENABLE ROW LEVEL SECURITY;

-- -------------------------------
-- Step 3: Create policies for authenticated users
-- -------------------------------

-- User
CREATE POLICY "Users can select own row" ON "public"."User"
FOR SELECT
TO authenticated
USING ("id" = auth.uid());

CREATE POLICY "Users can update own row" ON "public"."User"
FOR UPDATE
TO authenticated
USING ("id" = auth.uid())
WITH CHECK ("id" = auth.uid());

-- Track
CREATE POLICY "Users can manage own tracks" ON "public"."Track"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Playlist
CREATE POLICY "Users can manage own playlists" ON "public"."Playlist"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- PlaylistTrack (via Playlist)
CREATE POLICY "Users can manage own playlist tracks" ON "public"."PlaylistTrack"
FOR ALL
TO authenticated
USING ("playlistId" IN (SELECT "id" FROM "public"."Playlist" WHERE "userId" = auth.uid()))
WITH CHECK ("playlistId" IN (SELECT "id" FROM "public"."Playlist" WHERE "userId" = auth.uid()));

-- Session
CREATE POLICY "Users can manage own sessions" ON "public"."Session"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- VerificationRequest
CREATE POLICY "Users can manage own verification requests" ON "public"."VerificationRequest"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Message
CREATE POLICY "Users can read own messages" ON "public"."Message"
FOR SELECT
TO authenticated
USING ("senderId" = auth.uid() OR "recipientId" = auth.uid());

CREATE POLICY "Users can send messages" ON "public"."Message"
FOR INSERT
TO authenticated
WITH CHECK ("senderId" = auth.uid());

-- Comment
CREATE POLICY "Users can manage own comments" ON "public"."Comment"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Like
CREATE POLICY "Users can manage own likes" ON "public"."Like"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Follow
CREATE POLICY "Users can manage own follows" ON "public"."Follow"
FOR ALL
TO authenticated
USING ("followerId" = auth.uid())
WITH CHECK ("followerId" = auth.uid());

-- Order
CREATE POLICY "Users can manage own orders" ON "public"."Order"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- OrderItem (via Order)
CREATE POLICY "Users can manage own order items" ON "public"."OrderItem"
FOR ALL
TO authenticated
USING ("orderId" IN (SELECT "id" FROM "public"."Order" WHERE "userId" = auth.uid()))
WITH CHECK ("orderId" IN (SELECT "id" FROM "public"."Order" WHERE "userId" = auth.uid()));

-- Transaction
CREATE POLICY "Users can manage own transactions" ON "public"."Transaction"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Notification
CREATE POLICY "Users can manage own notifications" ON "public"."Notification"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- ApiKey
CREATE POLICY "Users can manage own api keys" ON "public"."ApiKey"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Report
CREATE POLICY "Users can manage own reports" ON "public"."Report"
FOR ALL
TO authenticated
USING ("reporterId" = auth.uid())
WITH CHECK ("reporterId" = auth.uid());

-- Analytics
CREATE POLICY "Users can manage own analytics" ON "public"."Analytics"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Account
CREATE POLICY "Users can manage own accounts" ON "public"."Account"
FOR ALL
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());