import { useState, useEffect, useRef } from 'react';
import HoverableTextInput from './Input';
import { callGemini } from '../services/editFrame';


const P5Sketch = ({ sketchCodes, prompt , index , setP5Script, API_KEY }: { sketchCodes: string[], prompt: string, index:number, setP5Script:(script:string[])=> void, API_KEY:string }) => {

  const sketchRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sketchInstance = useRef<any>(null);
  
  console.log({index})

  console.log("hi")

  useEffect(() => {

    if (sketchInstance.current) {
      sketchInstance.current.remove();
      sketchInstance.current = null;
    }

    if (typeof window === 'undefined' ) return;

    import('p5').then(module => {
      const p5 = module.default;
    
    if (!sketchRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sketch = new Function('p', sketchCodes[index]) as (...args: any[]) => any;
    
    sketchInstance.current = new p5(sketch, sketchRef.current);
    })
    
    return () => {
      if (sketchInstance.current) {
        sketchInstance.current.remove();
        sketchInstance.current = null;
      }
    };
  }, [sketchCodes, index]);

  const handleTextSubmit = (text:string) => {

          callGemini(text, prompt, API_KEY).then(response => {
            if (response) {
              console.log({response})
              sketchCodes[index] = response;
              setP5Script(sketchCodes);
            }
      });
  }
  
  return (
    <div className="border border-gray-300 rounded-md overflow-x-auto mb-4 hover:border-blue-600 border overflow-y-hidden">
      <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Sketch {index + 1}</div>
      <div ref={sketchRef} className=" relative" style={{ transform:`scale(0.35)`,  transformOrigin: 'top left', height:'160px' }} ></div>
   
      <HoverableTextInput 
            key={index}
            placeholder={`Enter new text for item`}
            onSubmit={handleTextSubmit}
      />
    
    </div>
  );
};

export default function P5Sidebar({ sketchCodes = [] , prompts, setP5Script, API_KEY }: { sketchCodes: string[], prompts:string[] , setP5Script: (script:string[]) => void, API_KEY:string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  console.log("Hello")
  return (
    <div className="flex relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md z-50"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 overflow-y-auto`}
        style={{ width: '320px', maxWidth: '80vw', zIndex: 40 }}
      >
        {/* Main Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">P5.js Sketches</h2>
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Render all P5.js sketches */}
            <div className="space-y-4">
              {sketchCodes.map((sketchCode, index) => (
                <P5Sketch key={index} sketchCodes={sketchCodes} prompt={prompts[index]} index={index} setP5Script={setP5Script} API_KEY={API_KEY}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}