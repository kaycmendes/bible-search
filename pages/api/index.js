const { Configuration, OpenAIApi } = require("openai");
const { version } = require("react-dom");



const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY 
});

const openai = new OpenAIApi(configuration);

async function bibleSearch(query) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
            `Find a Bible verse "KJV and KJV portugues only" that help with the request:${query}. reply it as a JSON object with a 'verse' and 'location' variable, space between words, dont include the location inside the verse, IT HAS TO BE JSON, if ask in pt/br reply in pt/br"`,
        "max_tokens": 100
    });


    //old prompt Find a bible verse in the holy bible that talks about or mention this subject, ${query}." 
      //output ONLY as JSON object 2 var, verse named "verse" and verse location named "location", extrmely important: be short and no whitespace

    let data = completion.data.choices[0].text
    let verseData = await JSON.parse(data)
    let locationData = await JSON.parse(data)
    locationData = await verseData.location
    verseData = await verseData.verse
    console.log(data)
    let result = {
        "locationData": locationData,
        "verseData": verseData
    }
    return result
}

module.exports = bibleSearch;