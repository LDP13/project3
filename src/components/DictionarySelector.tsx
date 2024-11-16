import React from 'react';
import { Book, Sparkles, CheckCircle2 } from 'lucide-react';
import type { DictionaryType } from '../utils/words';

interface DictionarySelectorProps {
  currentDictionary: DictionaryType;
  onDictionaryChange: (type: DictionaryType) => void;
}

export const DictionarySelector: React.FC<DictionarySelectorProps> = ({
  currentDictionary,
  onDictionaryChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto mb-8">
      <button
        onClick={() => onDictionaryChange('basic')}
        className={`relative p-6 rounded-xl transition-all duration-200 ${
          currentDictionary === 'basic'
            ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400 shadow-lg scale-[1.02]'
            : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 shadow-md hover:scale-[1.01]'
        }`}
      >
        {currentDictionary === 'basic' && (
          <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-500 dark:text-blue-400" />
        )}
        <div className="flex flex-col items-center text-center space-y-3">
          <Book className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dictionnaire Basique
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            200 mots courants pour débuter et progresser à votre rythme
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
            Recommandé pour débuter
          </div>
        </div>
      </button>

      <button
        onClick={() => onDictionaryChange('advanced')}
        className={`relative p-6 rounded-xl transition-all duration-200 ${
          currentDictionary === 'advanced'
            ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 dark:border-purple-400 shadow-lg scale-[1.02]'
            : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 shadow-md hover:scale-[1.01]'
        }`}
      >
        {currentDictionary === 'advanced' && (
          <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-purple-500 dark:text-purple-400" />
        )}
        <div className="flex flex-col items-center text-center space-y-3">
          <Sparkles className="w-10 h-10 text-purple-500 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dictionnaire Avancé
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            1000 mots variés pour les dactylographes expérimentés
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
            Pour les experts
          </div>
        </div>
      </button>
    </div>
  );
};