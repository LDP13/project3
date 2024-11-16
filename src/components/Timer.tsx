import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isActive }) => {
  return (
    <div className="flex items-center">
      <TimerIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      <span className="text-lg font-semibold text-gray-900 dark:text-white">{timeLeft}s</span>
    </div>
  );
};