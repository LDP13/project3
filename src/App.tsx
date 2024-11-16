import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';
import { Timer } from './components/Timer';
import { WordDisplay } from './components/WordDisplay';
import { Stats } from './components/Stats';
import { getRandomWords } from './utils/words';

const GAME_DURATION = 60; // secondes
const WORDS_PER_SET = 20;

function App() {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [correctWords, setCorrectWords] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [completedWords, setCompletedWords] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const initializeGame = useCallback(() => {
    const initialWords = getRandomWords(WORDS_PER_SET);
    setWords(initialWords);
    setTimeLeft(GAME_DURATION);
    setIsActive(false);
    setCurrentWordIndex(0);
    setUserInput('');
    setCorrectWords(0);
    setTotalAttempts(0);
    setWordsPerMinute(0);
    setGameOver(false);
    setCompletedWords(new Array(initialWords.length).fill(false));
    setStartTime(null);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          if (newTime >= 0) {
            const elapsedMinutes = (GAME_DURATION - newTime) / 60;
            setWordsPerMinute(Math.round(correctWords / elapsedMinutes));
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, correctWords]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && !gameOver) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!gameOver && isActive) {
        const isCorrect = userInput.trim() === words[currentWordIndex];
        if (isCorrect) {
          setCorrectWords((prev) => prev + 1);
        }
        setTotalAttempts((prev) => prev + 1);
        setCompletedWords(prev => {
          const newCompletedWords = [...prev];
          newCompletedWords[currentWordIndex] = isCorrect;
          return newCompletedWords;
        });
        setUserInput('');

        if (currentWordIndex === words.length - 1) {
          const newWords = getRandomWords(WORDS_PER_SET);
          setWords(newWords);
          setCurrentWordIndex(0);
          setCompletedWords(new Array(WORDS_PER_SET).fill(false));
        } else {
          setCurrentWordIndex((prev) => prev + 1);
        }
      }
    }
  };

  const handleTimeUp = () => {
    setGameOver(true);
    setIsActive(false);
    const minutes = GAME_DURATION / 60;
    setWordsPerMinute(Math.round(correctWords / minutes));
  };

  const accuracy = totalAttempts > 0 
    ? Math.round((correctWords / totalAttempts) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Keyboard className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">DactyloFast</h1>
          <p className="text-gray-600">Tapez les mots le plus rapidement possible</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between mb-4">
            <Timer timeLeft={timeLeft} onTimeUp={handleTimeUp} isActive={isActive} />
            <Stats wordsPerMinute={wordsPerMinute} accuracy={accuracy} />
            <button
              onClick={initializeGame}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </button>
          </div>

          {!gameOver ? (
            <>
              <WordDisplay 
                words={words}
                currentIndex={currentWordIndex}
                userInput={userInput}
                completedWords={completedWords}
              />
              <input
                type="text"
                value={userInput}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="w-full p-4 border-2 border-indigo-200 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 transition-colors font-mono text-lg"
                placeholder="Tapez le mot ici..."
                autoFocus
              />
            </>
          ) : (
            <div className="mt-6 text-center">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                <p className="text-lg font-semibold">Temps écoulé ! 🎉</p>
                <p>Vous avez tapé {wordsPerMinute} mots par minute avec {accuracy}% de précision</p>
                <p className="mt-2">Mots corrects : {correctWords} sur {totalAttempts}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;