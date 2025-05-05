"use client"

import React, { useEffect, useRef } from 'react';

interface AnimationCanvasProps {
  p5Script: string;
}

export const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ p5Script }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    
    if (typeof window === 'undefined') return;

    import('p5').then(module => {
      const p5 = module.default;
      
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      
      if (canvasRef.current && p5Script) {
        try {
          
          const sketch = new Function('p', p5Script);
          //@ts-expect-error-it can cause error
          p5InstanceRef.current = new p5(sketch, canvasRef.current);
        } catch (error) {
          console.error('Error initializing p5:', error);
        }
      }
    }).catch(error => {
      console.error('Error loading p5:', error);
    });
    
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [p5Script]);

  return (
    <div className='animation-canvas-container'>
      <div
        ref={canvasRef}
        className="animation-canvas w-full"
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      />
      {!p5Script && (
        <div className="empty-canvas-message">
          <p>Enter a prompt to generate an animation</p>
        </div>
      )}
    </div>
  );
};