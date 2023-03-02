import React, { useState, useEffect } from 'react';

const bibleSearch = require('./api/index.js')




let Cards = ({ results }) => {


    return (
        <div className="p-4 overflow-y-auto ">

            {
                <ul>
                    {Object.entries(results).map(([key, value]) => (
                        <li key={key}>
                            <Card verse={value.verse} verseLocation={value.verseLocation} query={value.query} />
                        </li>
                    ))}
                </ul>
            }
        </div>
    );

}

let Card = ({ verse, verseLocation, query }) => {
    return (
        <div className="shadow-md rounded-lg p-4 text-white my-4" id="left-card">
            <p className="font-medium text-sm mb-2 italic">{verseLocation}</p>
            <p className="text-lg font-bold mb-2">{verse}</p>
            <p className="text-sm font-medium italic">{query}</p>
        </div>
    );
};
export default Cards;
