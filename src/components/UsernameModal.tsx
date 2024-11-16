import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UsernameModalProps {
  onSubmit: (username: string) => void;
  wpm: number;
  accuracy: number;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit, wpm, accuracy }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bravo !</h2>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Vous avez tapé <span className="font-bold text-blue-600 dark:text-blue-400">{wpm} MPM</span> avec{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">{accuracy}%</span> de précision
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Entrez votre pseudo pour sauvegarder votre score
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
              placeholder="Votre pseudo"
              autoFocus
              maxLength={20}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sauvegarder mon score
          </button>
        </form>
      </div>
    </div>
  );
};