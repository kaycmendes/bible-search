export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query, version, lastVerse } = req.body;

    if (!process.env.NEXT_PUBLIC_CHUTES_API_TOKEN) {
      return res.status(500).json({ error: 'API token not configured' });
    }

    console.log('Received query:', query);

    const response = await fetch('https://chutes-nvidia-llama-3-1-405b-instruct-fp8.chutes.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHUTES_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: "nvidia/Llama-3.1-405B-Instruct-FP8",
        messages: [
          {
            role: "system",
            content: `You are a Bible expert. When providing Bible verses in ${version} version, follow these rules:
            1. Never repeat the same verse that was just given (last verse was: "${lastVerse}")
            2. Find a completely different passage that addresses the same topic
            3. Look in different books of the Bible for variety
            4. If multiple verses exist on the topic, choose a less commonly quoted one
            5. ${version === 'ACF' ? 'Provide the verse in Portuguese from Almeida Corrigida Fiel translation' : 'Provide the verse in English'}
            Return the response in this exact JSON format: {"verse": "verse text", "location": "book chapter:verse"}`
          },
          {
            role: "user",
            content: `Find a different Bible verse about "${query}" than "${lastVerse}". Choose a completely different passage.`
          }
        ],
        max_tokens: 256,
        temperature: 0.9,
        presence_penalty: 1.0,
        frequency_penalty: 1.0,
        stream: false
      })
    });

    if (!response.ok) {
      console.error('API Error:', response.status, await response.text());
      return res.status(response.status).json({ 
        error: `API request failed with status ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Extract only the JSON part from the response
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[^]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        const verse = parsedJson.verse;
        const verseLocation = parsedJson.location;

        // Strict validation to prevent same verse
        if (verseLocation === lastVerse) {
          console.log('Got same verse, retrying...');
          return handler(req, res);
        }

        // Also prevent similar verses (same chapter)
        if (lastVerse && verseLocation.split(':')[0] === lastVerse.split(':')[0]) {
          console.log('Got verse from same chapter, retrying...');
          return handler(req, res);
        }

        return res.status(200).json({
          verse,
          verseLocation,
          query
        });
      } catch (parseError) {
        console.error('Parse Error:', parseError);
        res.status(500).json({ 
          error: 'Failed to parse response',
          details: parseError.message 
        });
      }
    } else {
      res.status(500).json({ 
        error: 'No valid JSON found in response' 
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch response',
      details: error.message 
    });
  }
} 