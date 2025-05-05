import axios from 'axios';

//generate API KEY from google studio
const API_KEY = "  " ;
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

export const generateAnimation = async (prompt: string): Promise<string> => {
  try {

    const enhancedPrompt = `
        Create a p5.js animation based on the following description: "${prompt}".

Return only the JavaScript code in p5.js instance mode, with all methods and event handlers attached to a p object (like p.setup = () => { ... }).

Do not include any outer function, new p5(...), or arrow function wrapper.

The code should begin directly with any variable declarations and p.setup, followed by p.draw, etc.

Use p.createCanvas, p.background, p.ellipse, p.noise, etc. to reference all p5.js functions.

Your output must be directly executable inside a new p5(sketch, container) call — just the sketch body, no wrapping.

Run at 60 FPS. Make it creative, visually appealing, and interactive where appropriate. write error free code
    `;

    const response = await axios.post<GeminiResponse>(
      `${API_ENDPOINT}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt
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

    
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    
    console.log({generatedText})
    const cleanedCode = cleanP5Code(generatedText);
    console.log({cleanedCode})

    return cleanedCode;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate animation code');
  }
};

const cleanP5Code = (rawCode: string): string => {
 
const cleanedCode = rawCode.replace(/```(javascript|js)?\n/g, '').replace(/```$/g, '');
  
  return cleanedCode;
};