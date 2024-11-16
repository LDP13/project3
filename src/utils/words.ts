import { BASIC_WORD_LIST, ADVANCED_WORD_LIST } from './wordLists';

export type DictionaryType = 'basic' | 'advanced';

export const getWordList = (type: DictionaryType): string[] => {
  return type === 'basic' ? BASIC_WORD_LIST : ADVANCED_WORD_LIST;
};

export const getRandomWords = (count: number, dictionaryType: DictionaryType): string[] => {
  const words: string[] = [];
  const wordsCopy = [...getWordList(dictionaryType)];

  for (let i = 0; i < count; i++) {
    if (wordsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    words.push(wordsCopy.splice(randomIndex, 1)[0]);
  }

  return words;
};