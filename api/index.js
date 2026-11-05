export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ 
      "Devp": "NexGen Tech", 
      "Owner Name": "NexGen Tech Zone",
      "error": "Number missing in URL (?num=03XXXXXXXX)" 
    });
  }

  try {
    // Target API ka link encode kar rahe hain
    const targetApi = encodeURIComponent(`https://pakdataonline.site.je/?action=search&num=${num}`);
    
    // corsproxy.io ko as a middle-man use kar rahe hain block se bachne ke liye
    const response = await fetch(`https://corsproxy.io/?${targetApi}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const textData = await response.text();
    
    try {
      let originalData = JSON.parse(textData);

      // Purane channels aur credits remove karna
      if (typeof originalData === 'object' && originalData !== null && !Array.isArray(originalData)) {
        delete originalData.Channel; delete originalData.channel;
        delete originalData.Credit; delete originalData.credit;
        delete originalData.Developer; delete originalData.Owner; delete originalData.dev;
      }

      // NexGen Tech Zone ki branding ke sath response
      res.status(200).json({
        "Devp": "NexGen Tech",
        "Owner Name": "NexGen Tech Zone",
        ...(Array.isArray(originalData) ? { data: originalData } : originalData)
      });
      
    } catch (parseError) {
       res.status(500).json({
        "Devp": "NexGen Tech",
        "error": "Proxy ke zariye bhi API ne HTML page (Block/Captcha) bhej diya hai.",
        "html_preview": textData.substring(0, 100)
      });
    }

  } catch (error) {
    res.status(500).json({
      "Devp": "NexGen Tech",
      "error": "Fetch fail ho gaya",
      "reason": error.message
    });
  }
      }
          
