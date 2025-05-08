import axios from "axios";
import { parseAnimationSteps } from './parseAnimationSteps';
import { generateAnimationsInParallel } from './generateFrames';

interface GeminiResponse {
    candidates: {
      content: {
        parts: {
          text: string;
        }[];
      };
    }[];
  }
  
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';


export const generate3brown1blue = async (prompt: string , API_KEY:string , width:number , height:number ) => {

const storyMode = `
You are an Animation Scene Analyzer. Break down the following scene into sequential animation steps:

USER:${prompt}

Each step should be detailed such that it is a seperate animation of its own 

- give user prompt top most priority
- background should always be black by default
- diagrams and designs should be visually attractive
- even for simpler user inputs break down in detailed steps you can even add from your own in these case
- by default only gives 5-8 steps unless user specified

Animation Steps:
1. [First step]
2. [Second step]
and so on
`
try{
const storymode = await axios.post<GeminiResponse>(
    `${API_ENDPOINT}?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: storyMode
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    }
  );

  const output  = storymode.data.candidates[0].content.parts[0].text;
  console.log({output})
  const { characterInfo, steps } = parseAnimationSteps(output)
  console.log({steps})

      const consistentElement = 'none'; 
      const { generateContent, getPrompt} = await generateAnimationsInParallel(steps,characterInfo,consistentElement,width,height,API_KEY,API_ENDPOINT,"3brown1blue")
      return { generateContent, getPrompt }; 
    } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate animation code');
  }

}
