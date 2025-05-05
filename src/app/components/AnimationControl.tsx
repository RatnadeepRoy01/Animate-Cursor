import React from 'react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onDownload: () => void;
  hasAnimation: boolean;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onDownload,
  hasAnimation
}) => {
  return (
    <div className="animation-controls">
      {hasAnimation && (
        <>
          {isPlaying ? (
            <button 
              className="control-button pause-button" 
              onClick={onPause} 
              aria-label="Pause animation"
            >
              <span className="button-icon">⏸</span> Pause
            </button>
          ) : (
            <button 
              className="control-button play-button" 
              onClick={onPlay} 
              aria-label="Play animation"
            >
              <span className="button-icon">▶️</span> Play
            </button>
          )}
          
          <button 
            className="control-button download-button" 
            onClick={onDownload} 
            aria-label="Download animation"
          >
            <span className="button-icon">⬇️</span> Download
          </button>
        </>
      )}
    </div>
  );
};