const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = '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';
const configuration = new Configuration({
  apiKey : OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration);
const app = express();
//enable cors
app.use(cors());
async function getUserText(text) {
  return text;
}
app.get('/generateResponse', async (req, res) => {
  let userTextFinal = await getUserText(req.query.userText);
  let response = await getResponse(userTextFinal);
  res.send(response);
});
app.listen(1104, () => {
  console.log('Server is on port 1104');
})
async function getResponse(text) {
  const prompt = `You are a financial assistant offering advice on a breadth of topics such as budgeting and savings for college students.\nText: ${text.substring(0, 2000)}\nAnswer like you are messaging on a phone.`;
  console.log(prompt)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 4097 - prompt.length,
  });
  return completion.data.choices[0].text;
}