export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ "Devp": "NexGen Tech", "error": "Please provide a number parameter (?num=03XXXXXXXX)" });
  }

  try {
    // Fake Browser User-Agent bhej rahe hain taake API isey bot na samjhe
    const response = await fetch(`https://pakdataonline.site.je/?action=search&num=${num}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    const originalData = await response.json();

    // Faltu credits aur channel details remove karna
    if (typeof originalData === 'object' && originalData !== null && !Array.isArray(originalData)) {
      delete originalData.Channel; delete originalData.channel;
      delete originalData.Credit; delete originalData.credit;
      delete originalData.Developer; delete originalData.Owner; delete originalData.dev;
    }

    // Apna NexGen Tech Zone branding add karna
    res.status(200).json({
      "Devp": "NexGen Tech",
      "Owner Name": "NexGen Tech Zone",
      ...(Array.isArray(originalData) ? { data: originalData } : originalData)
    });

  } catch (error) {
    // Agar ab bhi fail ho toh error details show karega
    res.status(500).json({
      "Devp": "NexGen Tech",
      "error": "Source API ne connection reject kar diya.",
      "reason": error.message
    });
  }
  }
