export function buildFarm ({traits = [], season = null, dayOfSeason = null, kegs = null, casks = null, plantSpace = null, daysLeftOverall = null} = {}) {
    const newFarm = {kegs: 0,
      casks: 0,
      plantSpace: 1,
      season: 'summer',
      dayOfSeason: 1,
      daysLeftOverall: 30};
    
    for (const trait of traits) {
    switch(trait) {
      default:
        break;
    }
  }

  const params =  {kegs: kegs,
      casks: casks,
      plantSpace: plantSpace,
      season: season, season: season,
      dayOfSeason: dayOfSeason, daysLeftOverall};
  const nonNullParams = Object.keys(params).reduce((acc, key) => {
    if (params[key] !== null && params[key] !== undefined) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  Object.assign(newFarm, nonNullParams);
  Object.assign(newFarm, {daysLeftOfSeason: 27 - newFarm.dayOfSeason, 
      minDaysLeft: function() {
        return Math.min(this.daysLeftOfSeason, this.daysLeftOverall);
      },
      its2am: function() {
        if(this.dayOfSeason === 27) {
          this.dayOfSeason = 0;
          this.daysLeftOfSeason = 27;
        } else {
          this.dayOfSeason++;
          this.daysLeftOfSeason--;
        }
        this.daysLeftOverall--;
      }});
  
  return newFarm;
};