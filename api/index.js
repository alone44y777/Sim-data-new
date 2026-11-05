export default async function handler(req, res) {
  // CORS allow karne ke liye (agar frontend se call karni ho)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { num } = req.query;

  // Agar number provide nahi kiya gaya
  if (!num) {
    return res.status(400).json({
      "Devp": "NexGen Tech",
      "Owner Name": "NexGen Tech Zone",
      "error": "Please provide a number parameter (?num=03XXXXXXXX)"
    });
  }

  try {
    // Original API ko call karna
    const fetchResponse = await fetch(`https://pakdataonline.site.je/?action=search&num=${num}`);
    let originalData = await fetchResponse.json();

    // Purane credits, channels aur faltu details remove karna
    if (typeof originalData === 'object' && originalData !== null && !Array.isArray(originalData)) {
      delete originalData.Channel;
      delete originalData.channel;
      delete originalData.Credit;
      delete originalData.credit;
      delete originalData.Developer;
      delete originalData.Owner;
      delete originalData.dev;
    }

    // Apna Custom NexGen Tech Response tayyar karna
    const customResponse = {
      "Devp": "NexGen Tech",
      "Owner Name": "NexGen Tech Zone",
      // Baki ka kaam ka data (search results) yahan merge ho jayega
      ...(Array.isArray(originalData) ? { data: originalData } : originalData)
    };

    // Modified data wapis bhej dein
    res.status(200).json(customResponse);
    
  } catch (error) {
    // Agar original API down ho toh aapka error message jayega
    res.status(500).json({
      "Devp": "NexGen Tech",
      "Owner Name": "NexGen Tech Zone",
      "error": "Failed to fetch data from source API"
    });
  }
}
