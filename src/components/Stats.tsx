import React from 'react';
import { Trophy } from 'lucide-react';

interface StatsProps {
  wordsPerMinute: number;
  accuracy: number;
}

export const Stats: React.FC<StatsProps> = ({ wordsPerMinute, accuracy }) => {
  return (
    <div className="flex items-center">
      <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
      <span className="text-lg font-semibold text-gray-900 dark:text-white">{wordsPerMinute} MPM</span>
      <span className="mx-2 text-gray-900 dark:text-white">|</span>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">{accuracy}% précision</span>
    </div>
  );
};