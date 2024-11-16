import React from 'react';

interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  userInput: string;
  completedWords: boolean[];
}

export const WordDisplay: React.FC<WordDisplayProps> = ({ 
  words, 
  currentIndex, 
  userInput, 
  completedWords 
}) => {
  const isCurrentWordCorrect = (word: string, input: string): boolean => {
    return word.startsWith(input.trim());
  };

  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        {words.map((word, index) => {
          const isCurrentWord = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          if (isCurrentWord) {
            const isCorrect = isCurrentWordCorrect(word, userInput);
            return (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg border-3 transition-all transform ${
                  isCorrect 
                    ? 'bg-indigo-100 border-indigo-500 shadow-md' 
                    : 'bg-red-200 border-red-500 shadow-lg scale-110'
                }`}
              >
                {word.split('').map((char, charIndex) => {
                  let styles = 'text-2xl font-mono transition-all';
                  if (charIndex < userInput.length) {
                    if (userInput[charIndex] === char) {
                      styles += ' text-green-600';
                    } else {
                      styles += ' text-red-600 font-bold bg-red-100 px-1 rounded transform scale-110';
                    }
                  } else {
                    styles += ' text-gray-700';
                  }
                  return (
                    <span 
                      key={charIndex} 
                      className={`${styles} ${
                        userInput[charIndex] !== char && charIndex < userInput.length 
                          ? 'underline decoration-red-600 decoration-4'
                          : ''
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`px-4 py-3 rounded-lg transition-all ${
                isCompleted
                  ? completedWords[index]
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'bg-red-100 text-red-800 shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-xl font-mono">{word}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}