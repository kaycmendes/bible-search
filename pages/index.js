// Home.jsx
import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
const bibleSearch = require('./api/index.js');
import Cards from './Cards.jsx';
import BounceLoader from 'react-spinners/ClipLoader';


const Home = () => {
  const [query, setQuery] = useState('');
  const [verse, setVerse] = useState('Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you');
  const [verseLocation, setVerseLocation] = useState('Matthew 7:7');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let data = await bibleSearch(query);
    let locationData = data.locationData;
    let verseData = data.verseData;
    setVerse(verseData);
    setVerseLocation(locationData);
    setIsLoading(false);
    setIsSearched(true);
    setSearchResults([{ verse: verseData, verseLocation: locationData, query }, ...searchResults]);
    setQuery('');
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  return (
    <div className="flex h-screen flex-col-mobile">
    <div
        id="search"
        className={`w-full custom-bg content-center text-center flex h-screen ${
          isLoading ? 'hide-div' : ''
        }`}
      >
        <div className="content-center m-auto">
          <Navbar className="navbar" />
          <form onSubmit={handleSubmit} className="mb-2">
            <div className="w-100 flex flex-col mb-28">
              <h1 id="title" className="text-5xl font-bold text-center  text-slate-300">
                What do the Scriptures say regarding:
              </h1>
            </div>
            <div className="prompt flex flex-row justify-center">
              <input
                type="text"
                placeholder="Type here"
                value={query}
                onChange={handleInputChange}
                className="text-2xl rounded-l-xl  search-bar text-white"
              />
              <button type="submit" className="text-3xl -bottom-1  bg-slate-800 text-white p-4 rounded-r-xl">
                Search
              </button>
            </div>
          </form>
          <div className="relative  overflow-hidden top-28">
            <div className="inset-0 bg-card bg-blur m-auto w-3/4 shadow-2xl">
              <div className="card p-8 z-10 text-center">
                {isLoading ? (
                  <div className="sweet-loading">
                    <BounceLoader color="#535c6d" />
                  </div>
                ) : (
                  <div className="card-content flex-col m-auto w-auto">
                    <p className="text-2xl mb-7 response-box">{verse}</p>
                    <p className="response-box flex-auto text-xl font-semibold text-black-500 relative z-11">{verseLocation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="answer"
        className={`w-1/5 custom-bg-left content-center text-center flex flex-col h-screen ${
          isSearched ? '' : 'hidden-answer'
        }`}
      >
        <div className="flex flex-col w-full border-opacity-50 ">
          <div className="grid h-20 card bg-base-300 place-items-center rounded-none top-16 mb-10">List</div>
        </div>
        <div className="mobile-cards-bar">
          {isSearched && <Cards results={searchResults} />}
        </div>
      </div>
    </div>
  );
};

export default Home;

