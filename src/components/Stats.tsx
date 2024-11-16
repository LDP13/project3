import React from 'react';
import { Trophy } from 'lucide-react';

interface StatsProps {
  wordsPerMinute: number;
  accuracy: number;
}

export const Stats: React.FC<StatsProps> = ({ wordsPerMinute, accuracy }) => {
  return (
    <div className="flex items-center">
      <Trophy className="w-5 h-5 text-indigo-600 mr-2" />
      <span className="text-lg font-semibold">{wordsPerMinute} MPM</span>
      <span className="mx-2">|</span>
      <span className="text-lg font-semibold">{accuracy}% précision</span>
    </div>
  );
}