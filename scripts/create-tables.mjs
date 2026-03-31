// Script de création des tables Supabase
// Usage : node scripts/create-tables.mjs

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://shyoqtpmjrkusehsnzrh.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
-- Table produits
CREATE TABLE IF NOT EXISTS produits (
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

-- Table articles (blog)
CREATE TABLE IF NOT EXISTS articles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre       TEXT NOT NULL,
  resume      TEXT,
  contenu     TEXT,
  image       TEXT,
  publie      BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS produits_updated_at ON produits;
CREATE TRIGGER produits_updated_at
  BEFORE UPDATE ON produits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS produits
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique produits disponibles" ON produits;
CREATE POLICY "Lecture publique produits disponibles"
  ON produits FOR SELECT USING (disponible = true);

-- RLS articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique articles publiés" ON articles;
CREATE POLICY "Lecture publique articles publiés"
  ON articles FOR SELECT USING (publie = true);
`;

const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
});

// Fallback : utilise l'endpoint pg/query si rpc ne fonctionne pas
if (!res.ok) {
  const res2 = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (res2.ok) {
    console.log('✓ Tables créées avec succès !');
  } else {
    const body = await res2.text();
    // Si les tables existent déjà c'est ok
    if (body.includes('already exists')) {
      console.log('✓ Tables déjà existantes — OK');
    } else {
      console.log('→ Utilise le SQL Editor Supabase pour créer les tables manuellement.');
      console.log('  URL : https://supabase.com/dashboard/project/shyoqtpmjrkusehsnzrh/editor');
      console.log('  Fichier SQL : supabase-schema.sql');
    }
  }
} else {
  console.log('✓ Tables créées avec succès !');
}
