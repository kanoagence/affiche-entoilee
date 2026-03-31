import { supabase, supabaseAdmin } from './supabase';

// ─── Types ───────────────────────────────────────────────

export type Produit = {
  id: string;
  ref: string | null;
  titre: string;
  description: string | null;
  format: string | null;
  annee: string | null;
  auth: string | null;
  impression: string | null;
  categorie: string | null;
  theme: string | null;
  stk_e: number;
  stk_p: number;
  stk_c: number;
  etat: string | null;
  observations: string | null;
  affichiste: string | null;
  histoire_affichiste: string | null;
  commentaires: string | null;
  acteurs: string | null;
  realisateur: string | null;
  scenariste: string | null;
  musique: string | null;
  studio: string | null;
  photos: string[];
  prix: number | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  titre: string;
  resume: string | null;
  contenu: string | null;
  image: string | null;
  publie: boolean;
  created_at: string;
  updated_at: string;
};

// ─── Produits (public) ───────────────────────────────────

export async function getProduits(): Promise<Produit[]> {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getProduit(id: string): Promise<Produit | null> {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

// ─── Produits (admin) ────────────────────────────────────

export async function getProduitsAdmin(): Promise<Produit[]> {
  const { data, error } = await supabaseAdmin
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getProduitAdmin(id: string): Promise<Produit | null> {
  const { data, error } = await supabaseAdmin
    .from('produits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createProduit(
  produit: Omit<Produit, 'id' | 'created_at' | 'updated_at'>
): Promise<Produit | null> {
  const { data, error } = await supabaseAdmin
    .from('produits')
    .insert(produit)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function updateProduit(id: string, produit: Partial<Produit>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('produits')
    .update(produit)
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function deleteProduit(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('produits')
    .delete()
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

// ─── Articles (public) ───────────────────────────────────

export async function getArticles(onlyPublished = true): Promise<Article[]> {
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (onlyPublished) query = query.eq('publie', true);
  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

// ─── Articles (admin) ────────────────────────────────────

export async function getArticlesAdmin(): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getArticleAdmin(id: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createArticle(
  article: Omit<Article, 'id' | 'created_at' | 'updated_at'>
): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert(article)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('articles')
    .update(article)
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('articles')
    .delete()
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

// ─── Helpers ─────────────────────────────────────────────

export function formatPrix(prix?: number | null): string {
  if (!prix) return 'Sur devis';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(prix);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function etatLabel(etat: string | null): string {
  if (!etat) return '—';
  const labels: Record<string, string> = {
    entoilee: 'Entoilée',
    restauree: 'Restaurée',
    'a-restaurer': 'À restaurer',
  };
  return labels[etat] ?? etat;
}

export function stockTotal(p: Produit): number {
  return (p.stk_e ?? 0) + (p.stk_p ?? 0) + (p.stk_c ?? 0);
}

// ─── SEO Landing Pages ───────────────────────────────────

export type SeoPage = {
  id: string;
  slug: string;
  title_seo: string;
  meta_description: string | null;
  h1: string;
  texte_seo: string | null;
  image: string | null;
  mot_cle: string | null;
  produit_ids: string[];
  publie: boolean;
  created_at: string;
  updated_at: string;
};

export async function getSeoPage(slug: string): Promise<SeoPage | null> {
  const { data, error } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('publie', true)
    .single();
  if (error) return null;
  return data;
}

export async function getSeoPages(): Promise<SeoPage[]> {
  const { data, error } = await supabaseAdmin
    .from('seo_pages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getSeoPageAdmin(id: string): Promise<SeoPage | null> {
  const { data, error } = await supabaseAdmin
    .from('seo_pages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createSeoPage(
  page: Omit<SeoPage, 'id' | 'created_at' | 'updated_at'>
): Promise<SeoPage | null> {
  const { data, error } = await supabaseAdmin
    .from('seo_pages')
    .insert(page)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function updateSeoPage(id: string, page: Partial<SeoPage>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('seo_pages')
    .update(page)
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function deleteSeoPage(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('seo_pages')
    .delete()
    .eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

// ─── SEO Events (stats) ──────────────────────────────────

export type SeoStats = {
  slug: string;
  mot_cle: string | null;
  views_7d: number;
  views_30d: number;
  views_90d: number;
  views_365d: number;
  clicks: number;
  ctr: number;
  trend: number;
};

export async function getSeoStats(): Promise<SeoStats[]> {
  const pages = await getSeoPages();
  if (!pages.length) return [];

  const now = new Date();
  const since365 = new Date(now.getTime() - 365 * 86400000).toISOString();

  const { data: events } = await supabaseAdmin
    .from('seo_events')
    .select('page_slug, event_type, product_id, created_at')
    .gte('created_at', since365);

  const evts = events ?? [];

  return pages.map(p => {
    const pageEvts = evts.filter(e => e.page_slug === p.slug);
    const views = (d: number) => pageEvts.filter(
      e => e.event_type === 'view' &&
      new Date(e.created_at).getTime() > now.getTime() - d * 86400000
    ).length;
    const v7   = views(7);
    const v30  = views(30);
    const v90  = views(90);
    const v365 = views(365);
    const clicks = pageEvts.filter(e => e.event_type === 'product_click').length;
    return {
      slug:      p.slug,
      mot_cle:   p.mot_cle,
      views_7d:  v7,
      views_30d: v30,
      views_90d: v90,
      views_365d: v365,
      clicks,
      ctr:   v30 > 0 ? Math.round((clicks / v30) * 100) : 0,
      trend: v30 > 0 ? Math.round((v7 / v30) * 100) / 100 : 0,
    };
  });
}
