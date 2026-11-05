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
    // Original API link
    const targetUrl = `https://pakdataonline.site.je/?action=search&num=${num}`;
    
    // CodeTabs proxy use kar rahe hain (No API key required)
    const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${targetUrl}`);

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
        "error": "Source API abhi bhi block kar rahi hai (HTML page received).",
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
      
