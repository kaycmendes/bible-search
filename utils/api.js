export const searchBiblePassage = async (query) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch response');
    }

    const data = await response.json();
    
    try {
      const content = data.choices[0].message.content;
      const parsedContent = JSON.parse(content);
      
      if (!parsedContent.verse || !parsedContent.location) {
        throw new Error('Invalid response format');
      }

      return {
        verse: parsedContent.verse,
        verseLocation: parsedContent.location,
        query
      };
    } catch (error) {
      console.error('Parse Error:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    console.error('Error:', error);
    throw error;
  }
}; 