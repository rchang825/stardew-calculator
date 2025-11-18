import { expect, test, describe, it } from 'vitest';
import { buildCohort } from './factories/cohorts';
import { buildFarm } from './factories/farms';

describe('buildCohort', () => {
  it("works", () => {
    const cohort = buildCohort();
    expect(cohort).toEqual({quantity: 1, crop: 'hops', state: 'plant', age: 1});
  });

  it("supports a trait", () => {
    const cohort = buildCohort({traits: ['seed']});
     expect(cohort).toEqual({quantity: 1, crop: 'hops', state: 'seed', age: 0});
  });

  it("supports multiple traits", () => {
    const cohort = buildCohort({traits: ['seed', 'produce']});
    expect(cohort).toEqual({quantity: 1, crop: 'hops', state: 'produce', age: 0});
  });
});

describe('buildFarm', () => {
  it("works", () => {
    const farm = buildFarm();
    expect(farm.kegs).toEqual(0);
    expect(farm.casks).toEqual(0);
    expect(farm.plantSpace).toEqual(1)
    expect(farm.season).toEqual('summer');
    expect(farm.dayOfSeason).toEqual(1);
    expect(farm.daysLeftOverall).toEqual(30);
    expect(farm.daysLeftOfSeason).toEqual(26);
    expect(farm.minDaysLeft()).toEqual(26);
    expect(farm.its2am).toBeDefined();
  });
});