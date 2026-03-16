import type { APIRoute } from 'astro';
import * as XLSX from 'xlsx';

export const GET: APIRoute = () => {
  const headers = [
    'titre',
    'description',
    'annee',
    'etat',
    'prix',
    'surDevis',
    'disponible',
    'dimensions',
    'artiste',
    'imprimeur',
  ];

  const exampleRow = [
    'Air France — Paris New York',
    "Affiche originale chromolithographie en excellent état, composition graphique typique de l'aviation civile des années 50.",
    'c. 1949',
    'Entoilée',
    '2400',
    'non',
    'oui',
    '62 × 100 cm',
    'Lucien Boucher',
    'Imp. Perceval, Paris',
  ];

  const exampleRow2 = [
    'PLM — Les Alpes en hiver',
    'Superbe affiche de ski des chemins de fer PLM. Couleurs vives, légères restaurations.',
    'c. 1932',
    'Restaurée',
    '1800',
    'non',
    'oui',
    '80 × 120 cm',
    '',
    'Imp. Draeger, Paris',
  ];

  const exampleRow3 = [
    'Biarritz — Côte Basque',
    "Affiche de tourisme Biarritz, quelques manques à restaurer. Prix sur devis selon travaux.",
    'c. 1955',
    'À restaurer',
    '',
    'oui',
    'oui',
    '60 × 90 cm',
    'Roger Broders',
    '',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow, exampleRow2, exampleRow3]);

  // Largeurs de colonnes
  ws['!cols'] = [
    { wch: 35 }, // titre
    { wch: 60 }, // description
    { wch: 12 }, // annee
    { wch: 15 }, // etat
    { wch: 10 }, // prix
    { wch: 10 }, // surDevis
    { wch: 12 }, // disponible
    { wch: 15 }, // dimensions
    { wch: 20 }, // artiste
    { wch: 25 }, // imprimeur
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produits');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template-produits-herve.xlsx"',
    },
  });
};
