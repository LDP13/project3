export interface Score {
  username: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

const STORAGE_KEY = 'dactylofast_scores';

export const saveScore = (score: Score): void => {
  const scores = getScores();
  scores.push(score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
};

export const getScores = (): Score[] => {
  const scoresJson = localStorage.getItem(STORAGE_KEY);
  if (!scoresJson) return [];
  try {
    return JSON.parse(scoresJson);
  } catch {
    return [];
  }
};