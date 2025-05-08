"use client"

import React, { useEffect, useRef, useState } from 'react';

interface AnimationCanvasProps {
  p5Script: string[];
  width: number;
  height: number;
  playbackSpeed?: number;
  transitionDuration?: number;
}

export const AnimationCanvas: React.FC<AnimationCanvasProps> = ({
  p5Script,
  width,
  height,
  playbackSpeed = 10000,
  transitionDuration = 1,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p5InstanceRef = useRef<any>(null);
  const [currentScriptIndex, setCurrentScriptIndex] = useState<number>(0);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);
  const gsapLoadedRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    window.console.error = () => {};
    window.console.warn = () => {};
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !p5Script || p5Script.length === 0) return;

    const timer = setInterval(() => {
      if (gsapLoadedRef.current && transitionOverlayRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gsap = (window as any).gsap;
        
        gsap.to(transitionOverlayRef.current, {
          opacity: 1,
          duration: transitionDuration / 2,
          onComplete: () => {
           
            setCurrentScriptIndex(prevIndex => (prevIndex + 1) % p5Script.length);
            
            setTimeout(() => {
              gsap.to(transitionOverlayRef.current, {
                opacity: 0,
                duration: transitionDuration / 2
              });
            }, 100);
          }
        });
      } else {
        setCurrentScriptIndex(prevIndex => (prevIndex + 1) % p5Script.length);
      }
    }, playbackSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [p5Script, playbackSpeed, transitionDuration]);

  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!document.querySelector('script[src*="gsap"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.async = true;
      
      script.onload = () => {
        gsapLoadedRef.current = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load GSAP');
      };
      
      document.body.appendChild(script);
    } else {
      gsapLoadedRef.current = true;
    }
  }, []);

  
  useEffect(() => {
    if (typeof window === 'undefined' || !p5Script || p5Script.length === 0 || currentScriptIndex < 0) return;

    import('p5').then(module => {
      const p5 = module.default;

      if (canvasRef.current) {
        try {
          if (p5InstanceRef.current) {
            p5InstanceRef.current.remove();
            p5InstanceRef.current = null;
          }
          
          const currentScript = p5Script[currentScriptIndex];
          
          
          const sketchFunction = (p:import('p5')) => {
          
            const originalSketch = new Function('p', currentScript);
            originalSketch(p);
            
          
            const originalSetup = p.setup || (() => {});
            
          
            p.setup = function() {
            
              originalSetup.call(p);
              
                p.createCanvas(width, height);
              
            };
          };
          
         
          p5InstanceRef.current = new p5(sketchFunction, canvasRef.current);
          
        } catch (error) {
          console.error('Error initializing p5 instance:', error);
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
  }, [p5Script, currentScriptIndex, width, height]);

  const startRecording = () => {
    if (!p5InstanceRef.current || isRecording) return;
    
    try {
      const canvas = p5InstanceRef.current.canvas;
      if (!canvas) {
        console.error('No canvas element found in p5 instance');
        return;
      }

      const stream = canvas.captureStream(30); 
      
      const options = { mimeType: 'video/webm;codecs=vp9' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      recordedChunks.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);

          const totalSize = recordedChunks.current.reduce((size, chunk) => size + chunk.size, 0) / (1024 * 1024);
        
          if (totalSize >= 50) {
            stopRecording();
          }
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        downloadRecording();
      };
      
     
      mediaRecorderRef.current.start(100); 
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting capture:', error);
      setIsRecording(false);
      alert('Failed to start recording. Your browser may not support this feature.');
    }
  };

  const stopRecording = () => {
 
    if (!mediaRecorderRef.current) return;
    
    try {
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      console.log('Recording stopped');
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
    }
  };
  
  const downloadRecording = () => {
    try {
     
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      
      console.log('Video blob created, size:', Math.round(blob.size / 1024 / 1024 * 100) / 100, 'MB');
      
     
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `p5-animation-${Date.now()}.webm`;
      
    
      document.body.appendChild(link);
      link.click();
      
    
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      
      recordedChunks.current = [];
      
    } catch (error) {
      console.error('Error downloading recording:', error);
      alert('Error saving video. See console for details.');
    }
  };

  return (
    <div className="animation-canvas-container relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <div
        ref={canvasRef}
        className="animation-canvas w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      <div
        ref={transitionOverlayRef}
        className="transition-overlay absolute inset-0"
        style={{
          width: '100%', 
          height: '100%', 
          backgroundColor: 'black',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
      
      {(!p5Script || p5Script.length === 0) && (
        <div className="empty-canvas-message absolute inset-0 flex items-center justify-center">
          <p>Enter a prompt to generate an animation</p>
        </div>
      )}
      
      <div className="controls absolute bottom-4 right-4 flex gap-2">
        {isRecording ? (
          
            <button 
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              disabled={!isRecording}
            >
              <span className="mr-1">■</span> Stop Recording
            </button>
          
        ) : (
         
            
            <button 
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={isRecording || !p5Script || p5Script.length === 0}
            >
              <span className="mr-1">●</span> Record
            </button>
         
        )}
      </div>
    </div>
  );
};