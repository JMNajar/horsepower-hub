// Shared checkbox state for hub checklists (e.g. the Roadwear site-improvement list on /pod/roadwear/current/).
// State lives in the private Vercel Blob store "hub-checklists" as checklists/<list>.json:
//   { "<itemId>": { "done": true, "at": "2026-10-28T19:00:00.000Z" }, ... }
// GET  /api/checklist?list=roadwear          -> that JSON
// POST /api/checklist { list, id, done }     -> updates one item, returns the new JSON
// Password-protected by middleware.js like the pages that use it.
import { get, put } from '@vercel/blob';

const NAME = /^[a-z0-9-]{1,40}$/;
const path = list => `checklists/${list}.json`;

async function read(list) {
  const r = await get(path(list), { access: 'private', useCache: false });
  if (!r || !r.stream) return {};
  return JSON.parse(await new Response(r.stream).text());
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const list = (req.query.list || (req.body && req.body.list) || '').toString();
  if (!NAME.test(list)) return res.status(400).json({ error: 'bad list' });

  if (req.method === 'GET') return res.status(200).json(await read(list));

  if (req.method === 'POST') {
    const { id, done } = req.body || {};
    if (!NAME.test(String(id)) || typeof done !== 'boolean') return res.status(400).json({ error: 'bad item' });
    const state = await read(list);
    if (done) state[id] = { done: true, at: new Date().toISOString() };
    else delete state[id];
    await put(path(list), JSON.stringify(state, null, 1), {
      access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json',
    });
    return res.status(200).json(state);
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method not allowed' });
}
