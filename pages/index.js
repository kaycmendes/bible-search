import React, { useState, useEffect } from 'react';
// require('dotenv').config({ path: '../.env' })
import Navbar from './Navbar.jsx';
const bibleSearch = require('./api/index.js')
import Cards from './Cards.jsx'

const Home = () => {
  const [query, setQuery] = useState('');
  const [verse, setVerse] = useState('Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you');
  const [verseLocation, setVerseLocation] = useState('Matthew 7:7')
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = await bibleSearch(query)
    let locationData = data.locationData
    let verseData = data.verseData
    setVerse(verseData)
    setVerseLocation(locationData)
    setIsSearched(true);
    setSearchResults([{ verse: verseData, verseLocation: locationData, query }, ...searchResults]);
    setQuery('');
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    setQuery(inputValue)
  }

  return (
    <div className="flex h-screen ">
      <div className="w-4/5 custom-bg content-center text-center flex h-screen">
        <div className='content-center m-auto '>
          <Navbar />
          <form onSubmit={handleSubmit} className="mb-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-slate-700">
              What do the Scriptures say regarding:
            </h1>
            <input
              type="text"
              placeholder="Type here"
              value={query}
              onChange={handleInputChange}
              className="border mb-5 p-3 rounded-l-xl custom-bg border-gray-800 search-bar text-slate-800"
            />
            <button type="submit" className="bg-slate-800 text-white p-3 rounded-r-xl">Search</button>
          </form>
          <div className="relative rounded-lg overflow-hidden">
            <div className=" inset-0 bg-card bg-blur m-auto w-3/4 rounded-2xl">
              <div className="card p-8 z-10 text-center">

                {verse == '' ? (
                  isSearched && (
                    <div className="card-contentflex-col m-auto w-auto ">
                    <p className="text-lg font-serif mb-3">Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you</p>
                    <p className="flex-auto text-sm font-semibold text-black-500 relative z-11">Matthew 7:7</p>
                  </div>
                  )
                ) : (
                  <div className="card-contentflex-col m-auto w-auto ">
                      <p className="text-lg font-serif mb-3">{verse}</p>
                      <p className="flex-auto text-sm font-semibold text-black-500 relative z-11">{verseLocation}</p>
                    </div>
                )}



              </div>

            </div>

          </div>
        </div>
      </div>
      <div className='w-1/5 custom-bg-left content-center text-center flex h-screen '>
        {isSearched && <Cards results={searchResults} />}
      </div>
    </div>
  );
};

export default Home;
