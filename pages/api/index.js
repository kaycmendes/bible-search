const { Configuration, OpenAIApi } = require("openai");
const { version } = require("react-dom");




const configuration = new Configuration({
    apiKey: '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'
});

const openai = new OpenAIApi(configuration);

async function bibleSearch(query) {


    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
            `Find a bible verse in that talks about or mention this subject, ${query}." 
      output ONLY as JSON object 2 var, verse named "verse" and verse location named "location", extrmely important: be short, if ask in portuguese answer in portuguese
      `,
        "max_tokens": 100
    });

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




