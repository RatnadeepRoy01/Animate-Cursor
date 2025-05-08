import { useState } from 'react';

type HoverableTextInputProps = {
  placeholder?: string;
  onSubmit: (text: string) => void;
};

const HoverableTextInput: React.FC<HoverableTextInputProps> = ({
  placeholder = 'Enter text here...',
  onSubmit
}) => {
  const [text, setText] = useState('');
  
  const handleSubmit = () => {
    onSubmit(text);
  };
  
  return (
    <div 
      className=" relative border border-gray-300 rounded-md p-4 min-h-[100px] bg-gray-50 flex items-center justify-center "
    >
        <div className="absolute inset-0 bg-white p-3 flex flex-col">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded mb-2 font-sans text-sm resize-none"
            placeholder={placeholder}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md focus:outline-none"
            >
              Submit
            </button>
          </div>
        </div>
    </div>
  );
};

export default HoverableTextInput;