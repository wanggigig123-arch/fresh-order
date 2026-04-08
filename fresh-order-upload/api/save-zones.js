export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { zones, sheetUrl } = req.body;
    const zonesStr = JSON.stringify(zones);
    const url = `${sheetUrl}?action=saveZones&zones=${encodeURIComponent(zonesStr)}`;

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow'
    });

    const text = await response.text();
    console.log('Apps Script response:', text);

    res.status(200).json({ status: 'ok', response: text });
  } catch(err) {
    console.error('save-zones error:', err);
    res.status(500).json({ error: err.message });
  }
}
