import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Score {
  username: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
  userId?: string;
  userPhotoURL?: string;
}

const SCORES_COLLECTION = 'scores';

export const saveScore = async (score: Score): Promise<void> => {
  try {
    await addDoc(collection(db, SCORES_COLLECTION), score);
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

export const getScores = async (): Promise<Score[]> => {
  try {
    const scoresQuery = query(
      collection(db, SCORES_COLLECTION),
      orderBy('wpm', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(scoresQuery);
    return querySnapshot.docs.map(doc => doc.data() as Score);
  } catch (error) {
    console.error('Error getting scores:', error);
    return [];
  }
};