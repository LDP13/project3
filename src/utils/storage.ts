import { collection, addDoc, query, orderBy, limit, getDocs, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Score {
  username: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
  userId?: string;
  userPhotoURL?: string;
}

export interface CustomDictionary {
  id: string;
  name: string;
  words: string[];
  userId: string;
  isPublic: boolean;
  createdAt: number;
}

const SCORES_COLLECTION = 'scores';
const DICTIONARIES_COLLECTION = 'dictionaries';

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

export const saveDictionary = async (dictionary: Omit<CustomDictionary, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, DICTIONARIES_COLLECTION), dictionary);
    return docRef.id;
  } catch (error) {
    console.error('Error saving dictionary:', error);
    throw error;
  }
};

export const getDictionaries = async (userId?: string): Promise<CustomDictionary[]> => {
  try {
    let q;
    if (userId) {
      // Get user's dictionaries and public dictionaries
      q = query(
        collection(db, DICTIONARIES_COLLECTION),
        where('isPublic', '==', true)
      );
    } else {
      // Get only public dictionaries
      q = query(
        collection(db, DICTIONARIES_COLLECTION),
        where('isPublic', '==', true)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    if (userId) {
      // Get user's private dictionaries
      const userDictsQuery = query(
        collection(db, DICTIONARIES_COLLECTION),
        where('userId', '==', userId)
      );
      const userDictsSnapshot = await getDocs(userDictsQuery);
      
      // Combine and deduplicate results
      const allDicts = [...querySnapshot.docs, ...userDictsSnapshot.docs];
      const uniqueDicts = Array.from(new Set(allDicts.map(doc => doc.id)))
        .map(id => {
          const doc = allDicts.find(d => d.id === id)!;
          return {
            id: doc.id,
            ...doc.data()
          } as CustomDictionary;
        });
      
      return uniqueDicts;
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CustomDictionary));
  } catch (error) {
    console.error('Error getting dictionaries:', error);
    return [];
  }
};

export const deleteDictionary = async (dictionaryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, DICTIONARIES_COLLECTION, dictionaryId));
  } catch (error) {
    console.error('Error deleting dictionary:', error);
    throw error;
  }
};