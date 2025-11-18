import { expect, test, describe, it } from 'vitest';
import { simulate, plantSeeds } from '../src/services/cropSimulator';

test("runs successfully", () => {
  expect(simulate()).toBe(true);
});

let makeFarm = (dayOfSeason) => {
    return {
      kegs: 0,
      casks: 0,
      plantSpace: 1,
      season: 'summer',
      dayOfSeason: dayOfSeason,
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
};
describe('plantseeds', () => {
  it('plants if enough space', () => {
    const farm = makeFarm(1);
    const quantity = 1;
    const cohort = {quantity: quantity, crop: 'hops', state: 'seed', age: 0};

    expect(farm.plantSpace).toEqual(1);

    const newCohorts = plantSeeds(cohort, farm);

    expect(newCohorts.length).toEqual(1);
    const firstNewCohort = newCohorts[0];
    expect(firstNewCohort.state).toEqual('plant');
    expect(firstNewCohort.age).toEqual(1);
    expect(farm.plantSpace).toEqual(0);
  });
  it ('creates a new cohort of seeds if there is not enough plant space', () => {
    const farm = makeFarm(1);
    const cohort = {quantity: 2, crop: 'hops', state: 'seed', age: 0};
    expect(farm.plantSpace).toEqual(1);
    expect(cohort.quantity).toEqual(2);
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(2);
    expect(newCohorts.map((cohort) => cohort.state).sort()).toEqual(['plant', 'seed']);
  });
  it ('only plants seeds if there is enough time', () => {
    const farm = makeFarm(20);
    const cohort = {quantity: 1, crop: 'hops', state: 'seed', age: 0};
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(1);
    expect(newCohorts[0].state).toEqual('seed');
  });
});