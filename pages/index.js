import React, { useState, useEffect } from 'react';
// require('dotenv').config({ path: '../.env' })

const bibleSearch = require('./api/index.js')



const Home = () => {

  const [query, setQuery] = useState('');

  const [verse, setVerse] = useState('Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you');
  const [verseLocation, setVerseLocation] = useState('Matthew 7:7')


  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = await bibleSearch(query)
    let locationData = data.locationData
    let verseData = data.verseData
    setVerse(verseData)
    setVerseLocation(locationData)
    console.log("progress " + data)
  };



  const handleInputChange = (e) => {
    const inputValue = e.target.value
    setQuery(inputValue)
  }




  return (
    <div className="flex flex-col items-center justify-center h-screen custom-bg">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter your question or subject"
          value={query}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
      </form>
      <div className="relative rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-blur"></div>
        // inherit position inherit using tailwind
        <div className="card p-8 z-10 relative text-center">
          {(
            <div className="card-content">
              <p className="text-lg font-serif">{verse}</p>
              <p className="text-xs text-black-500 relative z-11">{verseLocation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
