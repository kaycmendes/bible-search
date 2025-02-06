import { useState } from 'react';

const YourComponent = () => {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          version: 'KJV' // or whatever version you're using
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Search error:', data.error);
        return;
      }

      const content = JSON.parse(data.choices[0].message.content);
      setCards(prevCards => [...prevCards, content]);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleRemoveCard = (indexToRemove) => {
    setCards(prevCards => prevCards.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="relative min-h-screen w-full p-8 flex flex-col items-center bg-white">
      <div className="relative w-full max-w-6xl mx-auto space-y-8">
        {/* Unified Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
          <div className="flex items-center w-full bg-[#fffbf2] rounded-lg shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 focus-within:ring-blue-500 focus-within:ring-2 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask the Bible..."
              className="w-full px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-500"
              aria-label="Ask the Bible"
            />
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button
              onClick={handleSearch}
              className="px-4 py-3 text-gray-500 hover:text-blue-600 rounded-r-lg focus:outline-none focus:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="relative bg-[#fffbf2] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-2">
                <p className="text-lg font-medium">{card.verse}</p>
                <p className="text-sm text-gray-600">{card.location}</p>
              </div>
              
              <button
                onClick={() => handleRemoveCard(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/50 transition-colors group"
                aria-label="Remove verse"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourComponent;