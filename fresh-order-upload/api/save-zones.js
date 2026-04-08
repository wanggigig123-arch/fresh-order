export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { zones, sheetUrl } = req.body;

    // 用 POST 傳送到 Apps Script
    const response = await fetch(sheetUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveZones', zones })
    });

    const text = await response.text();
    console.log('Apps Script response:', response.status, text);
    res.status(200).json({ status: 'ok', response: text });
  } catch(err) {
    console.error('save-zones error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
