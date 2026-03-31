import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'Aucun fichier fourni.' }), { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabaseAdmin.storage
      .from('affiches')
      .upload(path, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('affiches')
      .getPublicUrl(data.path);

    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Erreur serveur.' }), { status: 500 });
  }
};
