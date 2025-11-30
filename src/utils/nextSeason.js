export function nextSeason(currentSeason) {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const currentIndex = seasons.indexOf(currentSeason);
  const nextIndex = (currentIndex + 1) % seasons.length;
  return seasons[nextIndex];
};