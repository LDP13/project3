import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';
import { Timer } from './components/Timer';
import { WordDisplay } from './components/WordDisplay';
import { Stats } from './components/Stats';
import { Leaderboard } from './components/Leaderboard';
import { UsernameModal } from './components/UsernameModal';
import { ThemeToggle } from './components/ThemeToggle';
import { DictionarySelector } from './components/DictionarySelector';
import { AuthButton } from './components/AuthButton';
import { getRandomWords, type DictionaryType } from './utils/words';
import { saveScore, getScores, Score, saveDictionary, getDictionaries, deleteDictionary, type CustomDictionary } from './utils/storage';
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const GAME_DURATION = 60;

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
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryType>('basic');
  const [customDictionaries, setCustomDictionaries] = useState<CustomDictionary[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const loadDictionaries = useCallback(async () => {
    const dicts = await getDictionaries(user?.uid);
    setCustomDictionaries(dicts);
  }, [user?.uid]);

  useEffect(() => {
    loadDictionaries();
  }, [loadDictionaries]);

  const initializeGame = useCallback(() => {
    const initialWords = getRandomWords(20, dictionary, customDictionaries);
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
    setShowUsernameModal(false);
  }, [dictionary, customDictionaries]);

  useEffect(() => {
    initializeGame();
    const fetchScores = async () => {
      const fetchedScores = await getScores();
      setScores(fetchedScores);
    };
    fetchScores();
  }, [initializeGame]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && !gameOver) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setGameOver(true);
            setIsActive(false);
            if (user) {
              handleGameOver();
            } else {
              setShowUsernameModal(true);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, gameOver, user]);

  useEffect(() => {
    if (startTime && isActive && !gameOver) {
      const interval = window.setInterval(() => {
        const elapsedTimeInMinutes = (Date.now() - startTime) / 1000 / 60;
        setWordsPerMinute(Math.round(correctWords / elapsedTimeInMinutes));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [startTime, isActive, gameOver, correctWords]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isActive && !gameOver && value) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    setUserInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!gameOver && isActive && userInput.trim()) {
        const isCorrect = userInput.trim() === words[currentWordIndex];
        if (isCorrect) {
          setCorrectWords(prev => prev + 1);
        }
        setTotalAttempts(prev => prev + 1);
        setCompletedWords(prev => {
          const newCompletedWords = [...prev];
          newCompletedWords[currentWordIndex] = isCorrect;
          return newCompletedWords;
        });
        setUserInput('');

        if (currentWordIndex === words.length - 1) {
          const newWords = getRandomWords(20, dictionary, customDictionaries);
          setWords(newWords);
          setCurrentWordIndex(0);
          setCompletedWords(new Array(20).fill(false));
        } else {
          setCurrentWordIndex(prev => prev + 1);
        }
      }
    }
  };

  const handleGameOver = async () => {
    const score: Score = {
      username: user.displayName,
      wpm: wordsPerMinute,
      accuracy,
      timestamp: Date.now(),
      userId: user.uid,
      userPhotoURL: user.photoURL
    };
    await saveScore(score);
    const updatedScores = await getScores();
    setScores(updatedScores);
  };

  const handleUsernameSubmit = async (username: string) => {
    const score: Score = {
      username,
      wpm: wordsPerMinute,
      accuracy,
      timestamp: Date.now()
    };
    await saveScore(score);
    const updatedScores = await getScores();
    setScores(updatedScores);
    setShowUsernameModal(false);
  };

  const handleCreateDictionary = async (name: string, words: string[], isPublic: boolean) => {
    if (!user) return;

    const dictionary: Omit<CustomDictionary, 'id'> = {
      name,
      words,
      userId: user.uid,
      isPublic,
      createdAt: Date.now()
    };

    await saveDictionary(dictionary);
    await loadDictionaries();
  };

  const handleDeleteDictionary = async (id: string) => {
    await deleteDictionary(id);
    await loadDictionaries();
    if (dictionary === id) {
      setDictionary('basic');
    }
  };

  const handleDictionaryChange = (type: DictionaryType) => {
    setDictionary(type);
    if (!isActive) {
      initializeGame();
    }
  };

  const accuracy = totalAttempts > 0 
    ? Math.round((correctWords / totalAttempts) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <AuthButton user={user} />
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Keyboard className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">DactyloFast</h1>
          <p className="text-gray-600 dark:text-gray-300">Tapez les mots le plus rapidement possible</p>
        </div>

        <DictionarySelector 
          currentDictionary={dictionary}
          onDictionaryChange={handleDictionaryChange}
          customDictionaries={customDictionaries}
          onCreateDictionary={user ? handleCreateDictionary : undefined}
          onDeleteDictionary={user ? handleDeleteDictionary : undefined}
          user={user}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <Timer 
                timeLeft={timeLeft}
                isActive={isActive}
              />
            </div>
            <Stats wordsPerMinute={wordsPerMinute} accuracy={accuracy} />
            <button
              onClick={initializeGame}
              className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
                className="w-full p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-mono text-lg bg-white dark:bg-gray-700  text-gray-900 dark:text-white"
                placeholder="Tapez le mot ici..."
                autoFocus
              />
            </>
          ) : (
            <div className="mt-6 text-center">
              <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-4 rounded-lg">
                <p className="text-lg font-semibold">Temps écoulé ! 🎉</p>
                <p>Vous avez tapé {wordsPerMinute} mots par minute avec {accuracy}% de précision</p>
                <p className="mt-2">Mots corrects : {correctWords} sur {totalAttempts}</p>
              </div>
            </div>
          )}
        </div>

        <Leaderboard scores={scores} />

        {showUsernameModal && !user && (
          <UsernameModal
            onSubmit={handleUsernameSubmit}
            wpm={wordsPerMinute}
            accuracy={accuracy}
          />
        )}
      </div>
    </div>
  );
}

export default App;