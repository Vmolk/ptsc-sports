-- ============================================================
-- QAQC Sport Tournament — Supabase Schema
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tournaments
CREATE TABLE IF NOT EXISTS public.tournaments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  days        INT DEFAULT 1,
  location    TEXT,
  organizer   TEXT,
  status      TEXT NOT NULL DEFAULT 'upcoming'
                CHECK (status IN ('upcoming', 'live', 'finished', 'cancelled')),
  banner_url  TEXT,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sports
CREATE TABLE IF NOT EXISTS public.sports (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT DEFAULT '🏆',
  teams_count INT DEFAULT 0,
  format      TEXT,
  venue       TEXT,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  short       TEXT,
  color       TEXT DEFAULT '#1d3557',
  members     INT DEFAULT 0,
  image_url   TEXT,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id      TEXT REFERENCES public.sports(id) ON DELETE SET NULL,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round         TEXT,
  day           INT DEFAULT 1,
  match_time    TIME,
  venue         TEXT,
  home_team_id  TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  away_team_id  TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  home_score    INT,
  away_score    INT,
  status        TEXT NOT NULL DEFAULT 'upcoming'
                  CHECK (status IN ('upcoming', 'live', 'finished')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medals (for leaderboard)
CREATE TABLE IF NOT EXISTS public.medals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
  gold        INT DEFAULT 0,
  silver      INT DEFAULT 0,
  bronze      INT DEFAULT 0,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  UNIQUE (team_id, tournament_id)
);

-- Images / Gallery
CREATE TABLE IF NOT EXISTS public.images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT,
  url           TEXT NOT NULL,
  sport_id      TEXT,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  day           INT,
  uploaded_by   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Row Level Security ----
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images      ENABLE ROW LEVEL SECURITY;

-- Public read (service_role bypasses RLS automatically)
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read sports"      ON public.sports      FOR SELECT USING (true);
CREATE POLICY "Public read teams"       ON public.teams       FOR SELECT USING (true);
CREATE POLICY "Public read matches"     ON public.matches     FOR SELECT USING (true);
CREATE POLICY "Public read medals"      ON public.medals      FOR SELECT USING (true);
CREATE POLICY "Public read images"      ON public.images      FOR SELECT USING (true);

-- ---- Storage bucket for images ----
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- ---- Seed: default admin user ----
-- Password: qaqc2026  (bcrypt hash — change in production!)
INSERT INTO public.users (username, email, password_hash, role)
VALUES (
  'admin',
  'admin@qaqc.local',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCQ.rDSFAlcpXFWFJx4FYWK',
  'admin'
) ON CONFLICT (username) DO NOTHING;
