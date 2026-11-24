// Shared helpers para sa BCM Handbook API (Cloudflare Pages Functions + KV)
// Kinahanglan: KV binding nga ginganlan "BCM_KV" ug secret/variable nga "ADMIN_KEY".

// Gamiton ra kini sa PAGKA-UNA (kung walay sulod ang KV). Human niana, ang KV na ang tinuod nga listahan.
const DEFAULTS = [
  { name: "Pastor Frank", code: "7777", active: true },
  { name: "Jenelyn", code: "1403", active: true },
  { name: "Argie", code: "4444", active: true },
  { name: "Rosemarie", code: "0001", active: true },
  { name: "Pastor Jessie", code: "0002", active: true },
  { name: "Julibeth", code: "0003", active: true },
  { name: "Abraham", code: "0004", active: true },
  { name: "John Jersey", code: "0005", active: true },
  { name: "Faith", code: "3333", active: true },
  { name: "Aga", code: "0006", active: true },
  { name: "Jenefer", code: "0007", active: true },
  { name: "Roland", code: "0008", active: true },
  { name: "Raymund", code: "0009", active: true },
  { name: "Lilibeth", code: "0010", active: true },
  { name: "Leader", code: "0000", active: true },
  { name: "Disciple", code: "0011", active: true },
  { name: "Vince Elijah", code: "1234", active: true }
];

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function readBody(request) {
  try { return await request.json(); } catch (e) { return {}; }
}

export function missingSetup(env) {
  if (!env.BCM_KV) return json({ ok: false, error: "Wala pa na-setup ang KV (BCM_KV) sa Cloudflare." }, 500);
  return null;
}

export async function getLeaders(env) {
  const raw = await env.BCM_KV.get('leaders');
  if (!raw) {
    await env.BCM_KV.put('leaders', JSON.stringify(DEFAULTS));
    return DEFAULTS.map(l => ({ ...l }));
  }
  return JSON.parse(raw);
}

export async function saveLeaders(env, list) {
  await env.BCM_KV.put('leaders', JSON.stringify(list));
}

export function safeEqual(a, b) {
  a = String(a == null ? '' : a); b = String(b == null ? '' : b);
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const clean = (v, max = 60) => String(v == null ? '' : v).trim().slice(0, max);
