"use client"
import React, { useState  } from 'react';
import { AnimationCanvas } from './components/CanvasAnimation';
import { PromptInput } from './components/PromptInput';
import { AnimationControls } from './components/AnimationControl';
import { generateAnimation } from './services/geminiService';
import './globals.css';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [p5Script, setP5Script] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
    
      const generatedCode = await generateAnimation(prompt);
      setP5Script(generatedCode);
    } catch (err) {
      setError('Failed to generate animation. Please try again.');
      console.error('Animation generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
   
    alert('Download functionality will be implemented');
  };

  return (
    <div className="app-container w-sull">
      <header className="app-header w-full">
        <h1>Cursor AI Animation Studio</h1>
        <p>Create 2D animations with AI using natural language</p>
      </header>

      <main className="app-main">
        <div className="prompt-section">
          <PromptInput 
            prompt={prompt} 
            onPromptChange={handlePromptChange} 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
          />
        </div>

        <div className="canvas-section">
          <AnimationCanvas 
            p5Script={p5Script} 
          />
        </div>

        <div className="controls-section">
          <AnimationControls 
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onDownload={handleDownload}
            hasAnimation={!!p5Script}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
      </main>
      
      <footer className="app-footer">
        <p>Powered by Google Gemini and p5.js</p>
      </footer>
    </div>
  );
};

export default App;