import Scroll from "@/utils/ScrollAnimation";
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
            <div className="arrow">
            <Scroll />
            </div>
            

            <p className="card-item text-sm font-medium italic">{query}</p>
        </div>
    );
};
export default Cards;
