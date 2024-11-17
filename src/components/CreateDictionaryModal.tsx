import React, { useState } from 'react';
import { Book, X } from 'lucide-react';

interface CreateDictionaryModalProps {
  onClose: () => void;
  onSubmit: (name: string, words: string[], isPublic: boolean) => Promise<void>;
}

export const CreateDictionaryModal: React.FC<CreateDictionaryModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [words, setWords] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du dictionnaire est requis');
      return;
    }

    const wordList = words
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (wordList.length < 10) {
      setError('Le dictionnaire doit contenir au moins 10 mots');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(name.trim(), wordList, isPublic);
      onClose();
    } catch (error) {
      setError('Une erreur est survenue lors de la création du dictionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Book className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Créer un dictionnaire personnalisé
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom du dictionnaire
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2"
              placeholder="Ex: Vocabulaire professionnel"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="words" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mots (un par ligne)
            </label>
            <textarea
              id="words"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 font-mono"
              placeholder="Entrez vos mots ici&#10;Un mot par ligne"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Rendre ce dictionnaire public
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer le dictionnaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};