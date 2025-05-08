import axios from 'axios';
import { parseAnimationSteps } from './parseAnimationSteps';
import { generateAnimationsInParallel } from './generateFrames';

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}


 export const generateAnimation = async (prompt: string , API_KEY:string , width:number , height:number ) => {
   try {

    const storyMode = `
    You are an Animation Scene Analyzer. Break down the following scene into sequential animation steps:

USER:${prompt}

break down the animation into 5-8 sequential steps. Each step should be single, descriptive, and detailed sentence capturing a key moment in the animation.

- give user prompt top most priority

Format your response as:
Main Character: [brief description along with size and colour and anything extra]
Setting: [brief description]
Style: [style name] 
Colors: [color palette]


Example user input: 'A cat explores a mysterious forest at night.'
Example output (style = minimalist, colorful, calm):
1. A small white cat walks under a soft purple moon.
2. The cat gazes at glowing blue mushrooms along the path.
3. Gentle yellow fireflies dance around the cat.
4. The cat hops over a smooth gray log.
5. Two soft green lights glow from the bushes.
6. The cat trots happily into the glowing mist.


Animation Steps:
1. [First step]
2. [Second step]
and so on
    `
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

    const { characterInfo, steps } = parseAnimationSteps(output)
    console.log({characterInfo,steps})


const MainCharacter = `You are a P5.js Animation Code Generator. Create animation code based on the scene description below:

USER: ${prompt}

Requirements:
1. Generate ONLY p5.js code in instance mode
2. All methods and event handlers must be attached to a p object (like p.setup = function() { ... })
3. Do NOT include any outer function, new p5() constructor, or arrow function wrapper
4. Create variables for all characters and scene elements
5. Implement a complete p.setup() function that initializes the canvas
6. Create a p.draw() function with animation logic
7. Include any necessary helper functions
8. Use appropriate timing mechanisms for smooth animation
9. Maintain consistent character appearance throughout
10. Include detailed comments explaining the animation logic
11. also include what the code actually render

If the scene description lacks specific details (colors, sizes, etc.), use your creativity to establish a consistent visual style.

Return ONLY the ready-to-run p5.js code with no explanations before or after.`

const main = await axios.post<GeminiResponse>(
  `${API_ENDPOINT}?key=${API_KEY}`,
  {
    contents: [
      {
        parts: [
          {
            text: MainCharacter
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
const consistentElements = main.data.candidates[0].content.parts[0].text;


    const { generateContent, getPrompt} = await generateAnimationsInParallel(steps,characterInfo,consistentElements,width,height,API_KEY,API_ENDPOINT,"other")
    console.log({generateContent, getPrompt})
    return { generateContent, getPrompt };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate animation code');
  }
};
