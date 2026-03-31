-- ─── SEO Landing Pages ──────────────────────────────────
-- À coller dans : https://supabase.com/dashboard/project/shyoqtpmjrkusehsnzrh/editor

CREATE TABLE IF NOT EXISTS seo_pages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title_seo       TEXT NOT NULL,
  meta_description TEXT,
  h1              TEXT NOT NULL,
  texte_seo       TEXT,
  image           TEXT,
  mot_cle         TEXT,
  produit_ids     TEXT[] DEFAULT '{}',
  publie          BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug   TEXT NOT NULL,
  event_type  TEXT NOT NULL,   -- 'view' | 'product_click'
  product_id  TEXT,
  referrer    TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Trigger updated_at (réutilise la fonction existante)
DROP TRIGGER IF EXISTS seo_pages_updated_at ON seo_pages;
CREATE TRIGGER seo_pages_updated_at
  BEFORE UPDATE ON seo_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS : lecture publique uniquement si publie = true
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique seo_pages" ON seo_pages;
CREATE POLICY "Lecture publique seo_pages"
  ON seo_pages FOR SELECT USING (publie = true);

-- RLS : tout le monde peut insérer des events (tracking anonyme)
ALTER TABLE seo_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insert public seo_events" ON seo_events;
CREATE POLICY "Insert public seo_events"
  ON seo_events FOR INSERT WITH CHECK (true);

-- Index pour les requêtes de stats fréquentes
CREATE INDEX IF NOT EXISTS seo_events_slug_idx     ON seo_events (page_slug);
CREATE INDEX IF NOT EXISTS seo_events_type_idx     ON seo_events (event_type);
CREATE INDEX IF NOT EXISTS seo_events_created_idx  ON seo_events (created_at);
