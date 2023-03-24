const Cards = ({ results }) => {
    return (
        <div className="scrollable-cards">
            <ul className="cards-list">
                {Object.entries(results || {}).map(([key, value]) => (
                    <li key={key} className="card-item">
                        <Card verse={value.verse} verseLocation={value.verseLocation} query={value.query} />
                    </li>
                ))}
            </ul>
        </div>
    );
}


let Card = ({ verse, verseLocation, query }) => {
    return (
        <div className="shadow-md rounded-lg p-4 text-white my-4" id="left-card">
            <p className="card-item font-medium text-sm mb-2 italic">{verseLocation}</p>
            <p className="card-item font-medium text-sm mb-2 ">{verse}</p>
            <svg className="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>

            <p className="card-item text-sm font-medium italic">{query}</p>
        </div>
    );
};
export default Cards;
