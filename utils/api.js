let previousResponses = new Set();

export const searchBiblePassage = async (query, version) => {
  try {
    if (!query?.trim()) {
      throw new Error('Please enter a search query');
    }

    const lastVerse = Array.from(previousResponses).pop();
    
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query.trim(),
        version,
        lastVerse,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch response');
    }

    const data = await response.json();
    
    if (!data || !data.verseLocation) {
      throw new Error('Invalid response format');
    }
    
    previousResponses.add(data.verseLocation);
    
    if (previousResponses.size > 5) {
      previousResponses = new Set(Array.from(previousResponses).slice(-5));
    }

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}; 