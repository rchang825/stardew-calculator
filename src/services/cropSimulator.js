import { nextSeason } from '../utils/nextSeason.js';
const crops = {
  hops: {
    growthDays: 11,
    regrowthDays: 1,
    basePrice: 25,
    kegMinutes: 2250,
    jarMinutes: -1,
    caskDays: 34,
    seasons: ['summer']
  },
  ancientFruit: {
    growthDays: 28,
    regrowthDays: 7,
    basePrice: 25,
    kegMinutes: 10000,
    jarMinutes: 4000,
    caskDays: 56,
    seasons: ['spring', 'summer', 'fall']
  },
  corn: {
    growthDays: 14,
    regrowthDays: 4,
    basePrice: 50,
    kegMinutes: 3000,
    jarMinutes: 1500,
    caskDays: 42,
    seasons: ['summer', 'fall']
  },
};

export function plantSeeds(cohort, farm) {
  let numPlanting = cohort.quantity;
  let newCohorts = [];
  const crop = crops[cohort.crop];
  // validate season (including cross-season)
  if (crop.seasons.includes(farm.season)) {
    let crossSeason = crop.seasons.includes(nextSeason(farm.season)) ? 27 : 0;
    const daysLeft = Math.min(farm.daysLeftOverall, farm.daysLeftOfSeason + crossSeason);
    if (crop.growthDays < daysLeft) {
      if(numPlanting > farm.plantSpace) {
        let notPlantable = {
          quantity: numPlanting - farm.plantSpace,
          crop: cohort.crop,
          state: 'seed',
          age: 0,
        };
        newCohorts.push(notPlantable);
        numPlanting = farm.plantSpace;
      }
      cohort.state = 'plant';
      cohort.age = 1;
      farm.plantSpace = farm.plantSpace - numPlanting;
    }
  }
  newCohorts.push(cohort);
  return newCohorts;

};

function agePlants(cohort, farm, data) {
  let finalCohorts = [];
  // plantSeeds checks there's enough time, so no need to validate if enough time to grow

  // if at produce age, turn into produce
  const makesProduceAtAges = [data.growthDays];
  if(data.regrowthDays) {
    const regrowthCount = Math.floor((28 - data.growthDays) / data.regrowthDays);
    for(let i = 0; i < regrowthCount; i++) {
      makesProduceAtAges.push(i * data.regrowthDays + data.growthDays);
    }
  }
  if(makesProduceAtAges.includes(cohort.age)) {

  }
  const daysLeft = Math.min(farm.daysLeftOverall, farm.daysLeftInSeason);
  const ageable = daysTilProduce <= daysLeft;
  if(ageable) {
    cohort.age++;
    finalCohorts.push(cohort);
  } else { // no regrowth or not enough time (before end, or end of season) for regrowth
    // remove cohort
    farm.plantSpace = farm.plantSpace - cohort.quantity;
  }
  return finalCohorts;
};


function ageEachCohort(cohorts, farm) {
  let agedCohorts = [];
  for (const cohort of cohorts) {
    const crop = cohort.crop;
    const data = crops[crop];
    const state = cohort.state;

    if(state === 'seed') {
      // if enough time to grow this season, plant
      if(farm.minDaysLeft >= data.growthDays) {
        const newCohorts = [...plantSeeds(cohort, farm)];
        agedCohorts = agedCohorts.concat(newCohorts);
      }
    } else if(state === 'plant') {
      const newCohorts = [...agePlants(cohort, farm, data)];
      agedCohorts = agedCohorts.concat(newCohorts);
    } else if(state = 'produce') {
      agedCohorts.push(cohort);
    } else if(state === 'jar') {
      agedCohorts.push(cohort);
    } else if(state === 'keg') {
      agedCohorts.push(cohort);
    } else if(state === 'cask') {
      agedCohorts.push(cohort);
    }
  }
  return agedCohorts;
};

export function simulate() {
  const crop = 'hops';
  const quantity = 100;
  const days = 90;
  const kegs = 67;
  const casks = 125;
  const plantSpace = 1000;
  const season = 'summer';
  const dayOfSeason = 1;

  const diary = [];
  let cohorts = [];
  const farm = {
    kegs: kegs,
    casks: casks,
    plantSpace: plantSpace,
    season: season,
    dayOfSeason: dayOfSeason,
    daysLeftOfSeason: 27 - dayOfSeason,
    daysLeftOverall: days,
    minDaysLeft: function() {
      return Math.min(this.daysLeftOfSeason, this.daysLeftOverall);
    },
    its2am: function() {
      if(this.dayOfSeason === 27) {
        this.dayOfSeason = 0;
        this.daysLeftOfSeason = 27;
        this.season = nextSeason(this.season);
      } else {
        this.dayOfSeason++;
        this.daysLeftOfSeason--;
      }
      this.daysLeftOverall--;
    }
  };

  cohorts.push({quantity: quantity, crop: crop, state: 'seed', age: 0});
  for(let i = 0; i < days; i++) {
    console.log("Day ", i, "");
    const daysLeft = days - i;
    const agedCohorts = ageEachCohort(cohorts, farm);
    cohorts = agedCohorts;
    farm.its2am();
  };
  console.log(diary);
  return true;
}
