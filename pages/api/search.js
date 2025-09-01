export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query, version, lastVerse } = req.body;

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Google Gemini API key not configured' });
    }

    console.log('Starting search for:', query, 'Version:', version);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a Bible expert, you answer questions about anything in a biblical context, giving clarity and addressing modern day questions with a biblical perspective. When providing Bible verses in ${version} version, follow these rules:
                1. Never repeat the same verse that was just given (last verse was: "${lastVerse}")
                2. Find a completely different passage that addresses the same topic
                3. Stay true to the bible and only provide verses that are in the bible ONLY, and that are relevant to the question from a christian perspective, defending and representing it with scripture and explaining prophecies with passage i.e user ask "why did the flood happen" you should provide the passage "Genesis 6:4 and 6:5", explain prophecies with scripture even using multiple passages
                4. If the question is about current world events, provide a prophetic perspective, using scripture to support the answer
                5. You may include multiple passages if you find that more than one fits the query and supports the answer effectively.
                6. Look in different books of the Bible for variety
                7. TRANSLATION REQUIREMENTS:
                   ${version === 'KJV' ? '- Use the King James Version (KJV) translation with traditional "thee", "thou", "ye" language' : 
                     version === 'NKJV' ? '- Use the New King James Version (NKJV) translation with modern English but maintaining reverent language' :
                     version === 'ACF' ? '- Provide the verse in Portuguese from the Almeida Corrigida Fiel (ACF) translation' :
                     '- Use the King James Version (KJV) as default'}
                
                Find a different Bible verse about "${query}" than "${lastVerse}". Choose a completely different passage.
                
                IMPORTANT: Make sure to use the exact ${version} translation. The verse text must match the ${version} wording precisely.
                
                Return the response in one of these exact JSON formats:
                   - For a single passage: {"verse": "verse text", "location": "book chapter:verse"}
                   - For multiple passages: [{"verse": "verse text", "location": "book chapter:verse"}, {"verse": "verse text", "location": "book chapter:verse"}]`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('API Error Status:', response.status);
      console.error('API Error Text:', await response.text());
      
      if (response.status === 503) {
        return res.status(503).json({ 
          message: 'The Bible search service is temporarily unavailable. Please try again in a few moments.' 
        });
      }

      return res.status(response.status).json({ 
        message: `API request failed with status ${response.status}` 
      });
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ message: 'Invalid API response format' });
    }

    // Extract only the JSON part from the response
    const content = data.candidates[0].content.parts[0].text;
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
        return res.status(500).json({ 
          message: 'Failed to parse response',
          details: parseError.message 
        });
      }
    } else {
      return res.status(500).json({ 
        message: 'No valid JSON found in response' 
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch response',
      details: error.message 
    });
  }
} 