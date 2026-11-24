import { json, readBody, missingSetup, getLeaders, safeEqual, sleep, clean } from '../_shared.js';

export async function onRequestPost({ request, env }) {
  const bad = missingSetup(env); if (bad) return bad;
  const b = await readBody(request);
  const name = clean(b.name), code = clean(b.code, 30);
  const list = await getLeaders(env);
  const me = list.find(l => l.name.toLowerCase() === name.toLowerCase() && safeEqual(l.code, code));
  if (!me) { await sleep(500); return json({ ok: false, error: "Sayop ang Username o Code!" }, 401); }
  if (!me.active) return json({ ok: false, error: "Na-remove na kining account. Kontaka ang admin." }, 403);
  return json({ ok: true, name: me.name });
}
