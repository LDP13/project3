import React, { useState } from 'react';
import { Book, Sparkles, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import type { DictionaryType } from '../utils/words';
import type { CustomDictionary } from '../utils/storage';
import { CreateDictionaryModal } from './CreateDictionaryModal';

interface DictionarySelectorProps {
  currentDictionary: DictionaryType;
  onDictionaryChange: (type: DictionaryType) => void;
  customDictionaries: CustomDictionary[];
  onCreateDictionary?: (name: string, words: string[], isPublic: boolean) => Promise<void>;
  onDeleteDictionary?: (id: string) => Promise<void>;
  user: any | null;
}

export const DictionarySelector: React.FC<DictionarySelectorProps> = ({
  currentDictionary,
  onDictionaryChange,
  customDictionaries,
  onCreateDictionary,
  onDeleteDictionary,
  user
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateDictionary = async (name: string, words: string[], isPublic: boolean) => {
    if (onCreateDictionary) {
      await onCreateDictionary(name, words, isPublic);
    }
  };

  return (
    <>
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
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

        {(customDictionaries.length > 0 || user) && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dictionnaires personnalisés
              </h3>
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Créer un dictionnaire
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customDictionaries.map((dict) => (
                <button
                  key={dict.id}
                  onClick={() => onDictionaryChange(dict.id)}
                  className={`relative p-6 rounded-xl transition-all duration-200 text-left ${
                    currentDictionary === dict.id
                      ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400 shadow-lg scale-[1.02]'
                      : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-green-300 dark:hover:border-green-600 shadow-md hover:scale-[1.01]'
                  }`}
                >
                  {currentDictionary === dict.id && (
                    <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-green-500 dark:text-green-400" />
                  )}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {dict.name}
                      {dict.isPublic && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          Public
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {dict.words.length} mots
                    </p>
                  </div>
                  {user && dict.userId === user.uid && onDeleteDictionary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDictionary(dict.id);
                      }}
                      className="absolute bottom-4 right-4 p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDictionaryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDictionary}
        />
      )}
    </>
  );
};