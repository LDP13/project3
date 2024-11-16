import React from 'react';
import { Trophy } from 'lucide-react';

export interface Score {
  username: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

interface LeaderboardProps {
  scores: Score[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const sortedScores = [...scores].sort((a, b) => b.wpm - a.wpm);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-center mb-4">
        <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Meilleurs Scores</h2>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pseudo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MPM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Précision</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedScores.map((score, index) => (
              <tr key={`${score.username}-${score.timestamp}`} className={index === 0 ? "bg-yellow-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.wpm}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.accuracy}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(score.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};