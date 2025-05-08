"use client"
import React, { useState, useEffect } from 'react';
import { AnimationCanvas } from './components/CanvasAnimation';
import { PromptInput } from './components/PromptInput';
import { generateAnimation } from './services/geminiService';
import { generate3brown1blue } from './services/3Brown1Blue';
import P5Sidebar from './components/sideBar';
import './globals.css';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [p5Script, setP5Script] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [dimensions, setDimensions] = useState({  width: 300, height: 200, })
  const [style , setStyle] = useState("3brown1blue")
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<{
    generateContent: string[];
    getPrompt: string[];
  }>({
    generateContent: [],
    getPrompt: [],
  });
    
  useEffect(() => {
    const updateSize = () => {
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth <= 768;
      const scaleFactor = isMobile ? 0.8 : 0.5;
      const canvasWidth = windowWidth * scaleFactor;
      const canvasHeight = canvasWidth * 0.5625;

      setDimensions({
        width: Math.floor(canvasWidth),
        height: Math.floor(canvasHeight),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);
    
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
      setShowApiKeyModal(false);
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    let code: { 
      generateContent: (string | null)[], 
      getPrompt: string[] 
    } = {
      generateContent: [],  
      getPrompt: []        
    };

    try {
    
     if(style == "3brown1blue") {
        code = await generate3brown1blue(prompt,apiKey , dimensions.width , dimensions.height)
      }else{
        code = await generateAnimation(prompt,apiKey , dimensions.width , dimensions.height);
      }
      setGeneratedCode({
        getPrompt: code.getPrompt,
        generateContent: code.generateContent.filter((item): item is string => item !== null),
      })
  
      console.log({generatedCode})
      setP5Script(code.generateContent.filter((item): item is string => item !== null))
    } catch (err) {
      setError('Failed to generate animation. Please try again.');
      console.error('Animation generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container w-sull">
  <header className="app-header w-full relative">
  <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-3 gap-3 sm:gap-0">
    <div className="w-full sm:w-auto text-center sm:text-left">
      <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Cursor AI Animation
      </h1>
    </div>
    <button
      onClick={() => setShowApiKeyModal(true)}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      <span className="whitespace-nowrap">{apiKey ? 'Change API Key' : 'Enter API Key'}</span>
    </button>
  </div>
</header>
        <P5Sidebar sketchCodes={p5Script} prompts={generatedCode.getPrompt} setP5Script={setP5Script} API_KEY={apiKey}/>
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                API Key Setup
              </h2>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-6 text-gray-600 leading-relaxed">
              To use this application, you need a Google AI Studio API key. 
              Get your free API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Google AI Studio
              </a>
            </p>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                Save API Key
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="prompt-section">
          <PromptInput 
            prompt={prompt} 
            setP5Script={setP5Script}
            onPromptChange={handlePromptChange} 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            apiKey={apiKey}
            selectdOption={style}
            setSelectedOption={setStyle}
          />
        </div>

        <div className="canvas-sectio flex justify-center">
          <AnimationCanvas 
            p5Script={p5Script} 
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>

        {/* <div className="controls-section">
          <AnimationControls 
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onDownload={handleDownload}
            hasAnimation={!!p5Script}
          />
        </div> */}

        {error && <div className="error-message">{error}</div>}
      </main>
      
      <footer className="app-footer">
        <p>Powered by Google Gemini and p5.js</p>
      </footer>
    </div>
  );
};

export default App;
