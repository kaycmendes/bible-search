let previousResponses = new Set();

export const searchBiblePassage = async (query, version) => {
  try {
    if (!query?.trim()) {
      throw new Error('Please enter a search query');
    }

    const lastVerse = Array.from(previousResponses).pop();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data.shouldRetry) {
        throw new Error('Service temporarily unavailable. Please try again.');
      }
      throw new Error(data.error || 'Failed to fetch response');
    }
    
    if (!data || !data.verseLocation) {
      throw new Error('Invalid response format');
    }
    
    previousResponses.add(data.verseLocation);
    
    if (previousResponses.size > 5) {
      previousResponses = new Set(Array.from(previousResponses).slice(-5));
    }

    // Log which model was used
    console.log('Response from model:', data.modelUsed);

    return data;
  } catch (error) {
    console.error('Search error:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}; 