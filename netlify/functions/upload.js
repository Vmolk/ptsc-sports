import { ok, fail, handlePreflight, getSupabase, requireAuth } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  const { error: authError } = requireAuth(event, ['admin', 'editor']);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return fail('Storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.', 503);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const { file, filename, type } = body;
  if (!file || !filename) return fail('file (base64) and filename are required', 422);

  const buffer = Buffer.from(file, 'base64');
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  if (!allowed.includes(ext)) return fail('Unsupported file type', 422);

  const path = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, buffer, { contentType: type || `image/${ext}`, upsert: false });

  if (error) return fail(error.message, 500);

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
  return ok({ path: data.path, url: urlData.publicUrl }, 201, false);
}
