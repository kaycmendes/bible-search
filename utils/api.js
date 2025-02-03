let previousResponses = new Set();

export const searchBiblePassage = async (query, version) => {
  try {
    // Get the last verse to explicitly avoid
    const lastVerse = Array.from(previousResponses).pop();
    
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        version,
        lastVerse, // Send just the last verse to avoid
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const data = await response.json();
    
    // Add new response to our Set
    previousResponses.add(data.verseLocation);
    
    // Keep only the last 5 responses to manage memory
    if (previousResponses.size > 5) {
      previousResponses = new Set(Array.from(previousResponses).slice(-5));
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 