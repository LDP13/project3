import { BASIC_WORD_LIST, ADVANCED_WORD_LIST } from './wordLists';
import type { CustomDictionary } from './storage';

export type DictionaryType = 'basic' | 'advanced' | string;

export const getWordList = (type: DictionaryType, customDictionaries: CustomDictionary[] = []): string[] => {
  if (type === 'basic') return BASIC_WORD_LIST;
  if (type === 'advanced') return ADVANCED_WORD_LIST;
  
  const customDict = customDictionaries.find(dict => dict.id === type);
  return customDict?.words || BASIC_WORD_LIST;
};

export const getRandomWords = (count: number, dictionaryType: DictionaryType, customDictionaries: CustomDictionary[] = []): string[] => {
  const words: string[] = [];
  const wordsCopy = [...getWordList(dictionaryType, customDictionaries)];

  for (let i = 0; i < count; i++) {
    if (wordsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    words.push(wordsCopy.splice(randomIndex, 1)[0]);
  }

  return words;
};