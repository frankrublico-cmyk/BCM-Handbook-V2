import { json, readBody, missingSetup, getLeaders, saveLeaders, safeEqual, sleep, clean } from '../_shared.js';

export async function onRequestPost({ request, env }) {
  const bad = missingSetup(env); if (bad) return bad;
  const b = await readBody(request);
  const name = clean(b.name), oldCode = clean(b.oldCode, 30), newCode = clean(b.newCode, 30);
  if (!name || !oldCode || !newCode) return json({ ok: false, error: "Palihug pun-a ang tanang field." }, 400);
  if (newCode.length < 4) return json({ ok: false, error: "Ang bag-ong code kinahanglan labing menos 4 ka karakter." }, 400);
  if (newCode === oldCode) return json({ ok: false, error: "Ang bag-ong code kinahanglan lahi sa karaan." }, 400);

  const list = await getLeaders(env);
  const me = list.find(l => l.name.toLowerCase() === name.toLowerCase() && safeEqual(l.code, oldCode));
  if (!me) { await sleep(500); return json({ ok: false, error: "Sayop ang Username o karaang Code." }, 401); }
  if (!me.active) return json({ ok: false, error: "Na-remove na kining account. Kontaka ang admin." }, 403);
  if (list.some(l => l !== me && l.code === newCode)) return json({ ok: false, error: "Gigamit na kana nga code sa lain. Pili og lahi." }, 409);

  me.code = newCode;
  await saveLeaders(env, list);
  return json({ ok: true, name: me.name });
}
