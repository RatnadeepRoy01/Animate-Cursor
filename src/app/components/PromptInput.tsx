import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="prompt-examples">
          <h4>Example prompts:</h4>
          <ul>
            <li onClick={() => onPromptChange("Create a night sky with twinkling stars and a moon that phases through its cycle")}>
              Night sky with twinkling stars and moon phases
            </li>
            <li onClick={() => onPromptChange("Make a particle system where colorful particles follow the mouse cursor")}>
              Colorful particles that follow the mouse
            </li>
            <li onClick={() => onPromptChange("Animate a growing tree with branches that sway in the wind")}>
              Growing tree with swaying branches
            </li>
          </ul>
        </div>
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Animation'}
        </button>
      </form>
    </div>
  );
};