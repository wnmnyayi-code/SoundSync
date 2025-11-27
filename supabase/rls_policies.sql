-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "VerificationRequest" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Track" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Playlist" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "PlaylistTrack" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Follow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Analytics" ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own data" ON "User" FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can update their own data" ON "User" FOR
UPDATE USING (auth.uid () = id);

CREATE POLICY "Public profiles are viewable by everyone" ON "User" FOR
SELECT USING (true);
-- Adjust if you want to restrict public profile data

-- Account/Session Policies (Private)
CREATE POLICY "Users can view their own accounts" ON "Account" FOR ALL USING (auth.uid () = "userId");

CREATE POLICY "Users can view their own sessions" ON "Session" FOR ALL USING (auth.uid () = "userId");

-- Track Policies
CREATE POLICY "Public tracks are viewable by everyone" ON "Track" FOR
SELECT USING ("isPublic" = true);

CREATE POLICY "Users can view their own tracks" ON "Track" FOR
SELECT USING (auth.uid () = "userId");

CREATE POLICY "Users can insert their own tracks" ON "Track" FOR
INSERT
WITH
    CHECK (auth.uid () = "userId");

CREATE POLICY "Users can update their own tracks" ON "Track" FOR
UPDATE USING (auth.uid () = "userId");

CREATE POLICY "Users can delete their own tracks" ON "Track" FOR DELETE USING (auth.uid () = "userId");

-- Playlist Policies
CREATE POLICY "Public playlists are viewable by everyone" ON "Playlist" FOR
SELECT USING ("isPublic" = true);

CREATE POLICY "Users can view their own playlists" ON "Playlist" FOR
SELECT USING (auth.uid () = "userId");

CREATE POLICY "Users can manage their own playlists" ON "Playlist" FOR ALL USING (auth.uid () = "userId");

-- PlaylistTrack Policies
CREATE POLICY "Playlist tracks are viewable if playlist is public or owned" ON "PlaylistTrack"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Playlist" p
      WHERE p.id = "PlaylistTrack"."playlistId"
      AND (p."isPublic" = true OR p."userId" = auth.uid())
    )
  );

CREATE POLICY "Users can manage tracks in their playlists" ON "PlaylistTrack"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Playlist" p
      WHERE p.id = "PlaylistTrack"."playlistId"
      AND p."userId" = auth.uid()
    )
  );

-- Notification Policies
CREATE POLICY "Users can view their own notifications" ON "Notification" FOR
SELECT USING (auth.uid () = "userId");

CREATE POLICY "Users can update their own notifications" ON "Notification" FOR
UPDATE USING (auth.uid () = "userId");

-- Order/Transaction Policies
CREATE POLICY "Users can view their own orders" ON "Order" FOR ALL USING (auth.uid () = "userId");

CREATE POLICY "Users can view their own transactions" ON "Transaction" FOR ALL USING (auth.uid () = "userId");

-- Message Policies
CREATE POLICY "Users can view messages sent to or by them" ON "Message" FOR
SELECT USING (
        auth.uid () = "senderId"
        OR auth.uid () = "recipientId"
    );

CREATE POLICY "Users can send messages" ON "Message" FOR
INSERT
WITH
    CHECK (auth.uid () = "senderId");

-- Comment/Like Policies
CREATE POLICY "Comments are viewable by everyone" ON "Comment" FOR
SELECT USING (true);

CREATE POLICY "Users can create comments" ON "Comment" FOR
INSERT
WITH
    CHECK (auth.uid () = "userId");

CREATE POLICY "Users can delete their own comments" ON "Comment" FOR DELETE USING (auth.uid () = "userId");

CREATE POLICY "Likes are viewable by everyone" ON "Like" FOR
SELECT USING (true);

CREATE POLICY "Users can manage their likes" ON "Like" FOR ALL USING (auth.uid () = "userId");

-- Follow Policies
CREATE POLICY "Follows are viewable by everyone" ON "Follow" FOR
SELECT USING (true);

CREATE POLICY "Users can manage their follows" ON "Follow" FOR ALL USING (auth.uid () = "followerId");

-- Report Policies
CREATE POLICY "Users can create reports" ON "Report" FOR
INSERT
WITH
    CHECK (auth.uid () = "reporterId");

CREATE POLICY "Admins can view all reports" ON "Report" FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM "User" u
            WHERE
                u.id = auth.uid ()
                AND u.role = 'ADMIN'
        )
    );

-- Analytics/ApiKey Policies
CREATE POLICY "Users can view their own api keys" ON "ApiKey" FOR ALL USING (auth.uid () = "userId");

CREATE POLICY "Users can view their own analytics" ON "Analytics" FOR
SELECT USING (auth.uid () = "userId");