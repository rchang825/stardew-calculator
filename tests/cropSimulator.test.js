import { expect, test, describe, it } from 'vitest';
import { simulate, plantSeeds } from '../src/services/cropSimulator';

test("runs successfully", () => {
  expect(simulate()).toBe(true);
});


describe('plantseeds', () => {
  it('plants if enough space', () => {
    const dayOfSeason = 1;
    
    const farm = {
      kegs: 0, 
      casks: 0, 
      plantSpace: 1, 
      season: 'summer', 
      dayOfSeason: 0,
      daysLeftOfSeason: 27 - dayOfSeason,
      daysLeftOverall: 30,
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
      }
    };

    const quantity = 1;
    const crop = 'hops';
    const state = 'seed';
    const cohort = {quantity: quantity, crop: crop, state: state, age: 0};

    expect(farm.plantSpace).toEqual(1);

    const newCohorts = plantSeeds(cohort, farm);

    expect(newCohorts.length).toEqual(1);
    const firstNewCohort = newCohorts[0];
    expect(firstNewCohort.state).toEqual('plant');
    expect(firstNewCohort.age).toEqual(1);
    expect(farm.plantSpace).toEqual(0);
  });
});