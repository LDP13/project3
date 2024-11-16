import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, onTimeUp, isActive }) => {
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp, isActive]);

  return (
    <div className="flex items-center">
      <TimerIcon className="w-5 h-5 text-indigo-600 mr-2" />
      <span className="text-lg font-semibold">{timeLeft}s</span>
    </div>
  );
}