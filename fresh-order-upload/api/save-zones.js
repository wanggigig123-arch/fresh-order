export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { zones, sheetUrl } = req.body;
    const url = sheetUrl + "?action=saveZones&zones=" + encodeURIComponent(JSON.stringify(zones));
    await fetch(url);
    res.status(200).json({ status: 'ok' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
