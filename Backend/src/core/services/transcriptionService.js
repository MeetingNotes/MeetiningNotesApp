const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const transcribeFile = async (fileContent) => {
  try {
    //Generate Title
    const titleResult = await model.generateContent(`Give this a short two word title. Just write the title and no words before or after:\n${fileContent}`);
    const titleResponse = await titleResult.response;
    const title = titleResponse.text();

    // Generate Description
    const descriptionResult = await model.generateContent(`Summarize this meeting in two sentences. Just write the title and no words before or after:\n${fileContent}`);
    const descriptionResponse = await descriptionResult.response;
    const description = descriptionResponse.text();

    // Generate Bullet Points
    const notesResult = await model.generateContent(`Summarize this meeting. List the key points in bullet points. Simply start with the first one and continue. NO extra words before or after. Separate each point with a \\n:\n${fileContent}`);
    const notesResponse = await notesResult.response;
    const notes = notesResponse.text();
    
    return { title, description, notes };
  } catch (error) {
    console.error('Error transcribing file:', error);
    throw error;
  }
};


module.exports = { transcribeFile };


/* OpenAI (if we decide to bring it back)
const transcribeFile = async (fileContent) => {
    try {
        // Make the API request to OpenAI
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                prompt: fileContent,
                max_tokens: 2500
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Return the response data
        return response.data;
    } catch (error) {
        console.error('Error transcribing file:', error);
        throw error;
    }
};*/
