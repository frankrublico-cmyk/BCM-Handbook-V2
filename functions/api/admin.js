import { json, readBody, missingSetup, getLeaders, saveLeaders, safeEqual, sleep, clean } from '../_shared.js';

export async function onRequestPost({ request, env }) {
  const bad = missingSetup(env); if (bad) return bad;
  if (!env.ADMIN_KEY) return json({ ok: false, error: "Wala pa na-set ang ADMIN_KEY sa Cloudflare." }, 500);

  const b = await readBody(request);
  if (!safeEqual(b.key, env.ADMIN_KEY)) { await sleep(700); return json({ ok: false, error: "Sayop ang Admin Master Key!" }, 401); }

  const list = await getLeaders(env);
  const find = (n) => list.find(l => l.name.toLowerCase() === clean(n).toLowerCase());

  switch (b.action) {
    case 'list':
      return json({ ok: true, leaders: list });

    case 'add': {
      const name = clean(b.name), code = clean(b.code, 30);
      if (!name || !code) return json({ ok: false, error: "Palihug isulat ang pangalan ug code!" }, 400);
      if (find(name)) return json({ ok: false, error: "Kini nga lider naa na sa listahan!" }, 409);
      if (list.some(l => l.code === code)) return json({ ok: false, error: "Gigamit na kana nga code sa lain." }, 409);
      list.push({ name, code, active: true });
      break;
    }
    case 'toggle': {
      const l = find(b.name);
      if (!l) return json({ ok: false, error: "Wala makita ang lider." }, 404);
      l.active = !l.active;
      break;
    }
    case 'setcode': {
      const l = find(b.name), code = clean(b.code, 30);
      if (!l) return json({ ok: false, error: "Wala makita ang lider." }, 404);
      if (code.length < 4) return json({ ok: false, error: "Labing menos 4 ka karakter ang code." }, 400);
      if (list.some(x => x !== l && x.code === code)) return json({ ok: false, error: "Gigamit na kana nga code sa lain." }, 409);
      l.code = code;
      break;
    }
    default:
      return json({ ok: false, error: "Wala nakasabot sa aksyon." }, 400);
  }
  await saveLeaders(env, list);
  return json({ ok: true, leaders: list });
}
