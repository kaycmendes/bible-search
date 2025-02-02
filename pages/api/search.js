export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const CHUTES_API_TOKEN = "cpk_a21d92369b9b43579161cdd864add743.d8782563bdc55d56bee5be05ea4b9ce4.ntoycopY3SVhh2yMTtjj34Pi8vAsnm8r";

  try {
    console.log('Received query:', req.body.query);

    const response = await fetch('https://chutes-deepseek-ai-deepseek-r1.chutes.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHUTES_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "user",
            content: `Find a Bible verse about: "${req.body.query}". Respond ONLY with a JSON object in this exact format, with no additional text or explanation: {"verse": "the exact bible verse text", "location": "book chapter:verse"}. Do not include any other text, thoughts, or explanations.`
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
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
        res.status(200).json({
          choices: [{
            message: {
              content: JSON.stringify(parsedJson)
            }
          }]
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