import React, { useState } from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  colors: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  currentColor, 
  onColorChange,
  colors
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Choose accent color"
      >
        <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentColor === color ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full bg-${color}-500 mr-2`}></div>
                  <span className="capitalize text-gray-700 dark:text-gray-200">{color}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};