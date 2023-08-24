import Scroll from "@/utils/ScrollAnimation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faCopy } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify'; // Add this import
import { ToastContainer } from 'react-toastify';


const Cards = ({ results }) => {
    return (
        <div className="scrollable-cards">
            <ToastContainer />
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


    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `"${verse}" - ${verseLocation}`
      )}`;
    
      const handleCopy = () => {
        toast.success('Verse copied to clipboard!', {
          position: 'bottom-center',
          autoClose: 2000,
        });
      };
    return (
        <div className="shadow-md rounded-lg p-4 text-white my-4" id="left-card">
            <p className="card-item font-medium text-sm mb-2 italic">{verseLocation}</p>
            <p className="card-item font-medium text-sm mb-2 ">{verse}</p>

            <div className="arrow">
            <Scroll />
            </div>
            

            <p className="card-item text-sm font-medium italic">{query}</p>
            <div className="card-icons mt-2 flex justify-between items-center">
        <div className="icon" onClick={() => window.open(tweetUrl, '_blank')}>
          <FontAwesomeIcon icon={faTwitter} className="text-blue-400 cursor-pointer" />
        </div>
        <CopyToClipboard text={verse} onCopy={handleCopy}>
          <div className="icon cursor-pointer ">
            <FontAwesomeIcon icon={faCopy} className="text-green-400 cursor-pointer " />
          </div>
        </CopyToClipboard>
      </div>
        </div>
    );
};
export default Cards;
