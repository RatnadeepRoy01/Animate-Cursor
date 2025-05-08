import React from 'react';

interface PromptInputProps {
  prompt: string;
  setP5Script: (script:string[]) => void;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  apiKey: string;
  selectdOption: string;
  setSelectedOption: (option:string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setP5Script,
  onPromptChange,
  onSubmit,
  isLoading,
  apiKey,
  selectdOption,
  setSelectedOption

}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setP5Script([])
    onSubmit();
  };

  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="animation-prompt">Describe your animation:</label>
        <textarea
          id="animation-prompt"
          placeholder="E.g., Create a bouncing ball that changes colors when it hits the edges"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
       
      <select
        id="options"
        name="options"
        value={selectdOption}
        onChange={ (e) => setSelectedOption(e.target.value) }
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="3brown1blue">3brown1blue</option>
        <option value="Kids Animation">Kids Animation</option>
      </select>

        <div className="prompt-examples">
          <h4>Example prompts:</h4>
          <ul>
            <li onClick={() => onPromptChange(" Visualize the distribution of a large dataset of points generated from a normal distribution with a mean of 0 and a standard deviation of 1. Highlight the bell curve and discuss how the central limit theorem impacts the shape and spread of the data.")}>
            Visualize the distribution of a large dataset of points generated from a normal distribution with a mean of 0 and a standard deviation of 1. Highlight the bell curve and discuss how the central limit theorem impacts the shape and spread of the data.
            </li>
            <li onClick={() => onPromptChange(" Visualize the Fourier transform of a complex signal composed of multiple sine waves. Show how the transformation breaks down the signal into its frequency components, emphasizing the relationship between time-domain and frequency-domain representations.")}>
            Visualize the Fourier transform of a complex signal composed of multiple sine waves. Show how the transformation breaks down the signal into its frequency components, emphasizing the relationship between time-domain and frequency-domain representations.
            </li>
            <li onClick={() => onPromptChange(" Visualize the architecture of a scalable microservices system handling millions of user requests per second. Show how load balancers, distributed databases, and caching layers work together to ensure high availability and low latency.")}>
            Visualize the architecture of a scalable microservices system handling millions of user requests per second. Show how load balancers, distributed databases, and caching layers work together to ensure high availability and low latency.
            </li>
          </ul>
        </div>
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading || !prompt.trim() || apiKey == ''}
        >
          {isLoading ? 'Generating...' : 'Generate Animation'}
        </button>
      </form>
    </div>
  );
};