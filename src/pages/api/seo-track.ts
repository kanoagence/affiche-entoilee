import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { page_slug, event_type, product_id } = body;

    if (!page_slug || !event_type) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    if (!['view', 'product_click'].includes(event_type)) {
      return new Response(JSON.stringify({ error: 'Invalid event_type' }), { status: 400 });
    }

    await supabaseAdmin.from('seo_events').insert({
      page_slug,
      event_type,
      product_id: product_id ?? null,
      referrer:   request.headers.get('referer') ?? null,
      user_agent: request.headers.get('user-agent') ?? null,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
