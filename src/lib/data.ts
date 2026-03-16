import { getCollection, getEntry } from 'astro:content';

export async function getProduits() {
  const produits = await getCollection('produits');
  return produits.map((p) => ({
    ...p.data,
    slug: p.id,
  }));
}

export async function getProduit(slug: string) {
  try {
    const produit = await getEntry('produits', slug);
    if (!produit) return null;
    return {
      ...produit.data,
      slug: produit.id,
    };
  } catch {
    return null;
  }
}

export async function getArticles(onlyPublished = true) {
  const articles = await getCollection('blog');
  const sorted = articles
    .filter((a) => !onlyPublished || a.data.publie)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return sorted.map((a) => ({
    ...a.data,
    slug: a.slug,
    render: a.render.bind(a),
  }));
}

export async function getArticle(slug: string) {
  try {
    const article = await getEntry('blog', slug);
    if (!article) return null;
    return {
      ...article.data,
      slug: article.slug,
      render: article.render.bind(article),
    };
  } catch {
    return null;
  }
}

export function formatPrix(prix?: number, surDevis?: boolean): string {
  if (surDevis || !prix) return 'Sur devis';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(prix);
}

export function etatLabel(etat: string): string {
  const labels: Record<string, string> = {
    entoilee: 'Entoilée',
    restauree: 'Restaurée',
    'a-restaurer': 'À restaurer',
  };
  return labels[etat] ?? etat;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
