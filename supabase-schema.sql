-- =============================================
-- Table : produits
-- Hervé — Restauration & Entoilage d'Affiches
-- =============================================

CREATE TABLE produits (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref           TEXT UNIQUE,
  titre         TEXT NOT NULL,
  description   TEXT,
  format        TEXT,
  annee         TEXT,
  auth          TEXT,
  impression    TEXT,
  categorie     TEXT,
  theme         TEXT,
  stk_e         INTEGER DEFAULT 0,
  stk_p         INTEGER DEFAULT 0,
  stk_c         INTEGER DEFAULT 0,
  etat          TEXT,
  observations  TEXT,
  affichiste    TEXT,
  histoire_affichiste TEXT,
  commentaires  TEXT,
  acteurs       TEXT,
  realisateur   TEXT,
  scenariste    TEXT,
  musique       TEXT,
  studio        TEXT,
  photos        TEXT[] DEFAULT '{}',
  prix          NUMERIC,
  disponible    BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER produits_updated_at
  BEFORE UPDATE ON produits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS : lecture publique uniquement pour les produits disponibles
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique produits disponibles"
  ON produits FOR SELECT
  USING (disponible = true);

-- =============================================
-- Table : articles (blog)
-- =============================================

CREATE TABLE articles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre       TEXT NOT NULL,
  resume      TEXT,
  contenu     TEXT,
  image       TEXT,
  publie      BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique articles publiés"
  ON articles FOR SELECT
  USING (publie = true);
