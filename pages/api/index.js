import OpenAI from 'openai';
const { version } = require("react-dom");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY, // This is also the default, can be omitted
    dangerouslyAllowBrowser: true
  });
  

  async function bibleSearch(query) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Find a Bible verse "KJV only" that helps with the request: ${query}. Reply with a JSON object with 'verse' and 'location' variables, space between words, don't include the location inside the verse. It has to be JSON.`,
        },
      ],
      max_tokens: 150,
      top_p: 1,
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  
    // Process the completion response (assuming it's in JSON format)
    const data = await JSON.parse(completion.choices[0].message.content);
    const verseData = await data.verse;
    const locationData = await data.location;

   
    console.log(data)
    let result = {
        "locationData": locationData,
        "verseData": verseData
    }
    return result
}

module.exports = bibleSearch;