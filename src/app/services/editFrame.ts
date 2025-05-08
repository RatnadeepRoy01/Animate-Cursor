import axios from 'axios';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`;

interface GeminiResponse {
    candidates: {
      content: {
        parts: {
          text: string;
        }[];
      };
    }[];
  }

export async function callGemini(userPrompt: string, systemPromt: string, API_KEY: string): Promise<string | null> {  
  const API_ENDPOINT = API_URL + API_KEY
  const newPrompt = systemPromt+ "USER_PROMPT:" + userPrompt + `only return p5.js strictly no extra 
  text also avoid comment
       JUST provide the inner code body with:
      - Variable declarations
      - p.setup function
      - p.draw function
      - Any other necessary p methods
  
  `
  console.log({newPrompt})
   try {
    const response = await axios.post<GeminiResponse>(
      API_ENDPOINT,
      {
        contents: [
          {
            parts: [{ text: newPrompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.candidates[0]?.content.parts[0]?.text;

    const cleanCode = cleanP5Code(result)
    console.log({cleanCode})
    console.log('Gemini response:', cleanCode);
    return cleanCode;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

const cleanP5Code = (rawCode: string): string => {
 
  const cleanedCode = rawCode.replace(/```(javascript|js)?\n/g, '').replace(/```$/g, '');
  const removeFunction = cleanedCode.replace(/^const sketch = function\(p\) \{\n|\n\};$/g, ''); 
  
  return removeFunction
  }