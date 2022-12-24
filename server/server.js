import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {Configuration,OpenAIApi} from 'openai';
//Env Configuration
dotenv.config();

//OpenAI configuration
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY)
//Express configuration
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
  res.status(200).send({message : 'Hello from Codex'});
});

app.post('/', async (req, res) => {
try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${prompt}`,
        max_tokens: 3000,
        temperature: 0,
        top_p: 1,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
    
    });
    res.status(200).send({bot:response.data.choices[0].text});
} catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
}
});

app.listen(5000, () => {
  console.log('Server is running on port http://localhost:5000');
});