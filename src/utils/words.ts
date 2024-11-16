const WORD_LIST = [
  'maison', 'voiture', 'chat', 'chien', 'ordinateur',
  'table', 'livre', 'école', 'travail', 'famille',
  'jardin', 'soleil', 'lune', 'étoile', 'musique',
  'danse', 'peinture', 'cuisine', 'voyage', 'montagne',
  'rivière', 'forêt', 'plage', 'océan', 'ville',
  'village', 'route', 'train', 'avion', 'bateau',
  'fleur', 'arbre', 'oiseau', 'poisson', 'papillon',
  'téléphone', 'fenêtre', 'porte', 'mur', 'toit'
];

export const getRandomWords = (count: number): string[] => {
  const words: string[] = [];
  const wordsCopy = [...WORD_LIST];

  for (let i = 0; i < count; i++) {
    if (wordsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    words.push(wordsCopy.splice(randomIndex, 1)[0]);
  }

  return words;
};