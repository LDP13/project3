import React, { useState } from 'react';
import { LogIn, LogOut, User, AlertCircle } from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

interface AuthButtonProps {
  user: any | null;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ user }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setError('Erreur de déconnexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute -bottom-12 left-0 right-0 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-2 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.displayName}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Connexion avec Google
        </button>
      )}
    </div>
  );
};