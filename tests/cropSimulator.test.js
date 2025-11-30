import { expect, test, describe, it } from 'vitest';
import { simulate, plantSeeds } from '../src/services/cropSimulator';
import { buildCohort } from './factories/cohorts';
import { buildFarm } from './factories/farms';

test("runs successfully", () => {
  expect(simulate()).toBe(true);
});

describe('plantseeds', () => {
  it('does not plant seeds that are not of the current season', () => {
    const farm = buildFarm({dayOfSeason: 1, daysLeftOverall: 1, season: 'winter'});
    const cohort = buildCohort({traits: ['seed']})
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(1);
    expect(newCohorts[0].state).toEqual('seed');
  });
  it('plants if enough space', () => {
    const farm = buildFarm({dayOfSeason: 1, daysLeftOverall: 30});
    const cohort = buildCohort();

    expect(farm.plantSpace).toEqual(1);

    const newCohorts = plantSeeds(cohort, farm);

    expect(newCohorts.length).toEqual(1);
    const firstNewCohort = newCohorts[0];
    expect(firstNewCohort.state).toEqual('plant');
    expect(firstNewCohort.age).toEqual(1);
    expect(farm.plantSpace).toEqual(0);
  });
  it ('creates a new cohort of seeds if there is not enough plant space', () => {
    const farm = buildFarm({dayOfSeason: 1, daysLeftOverall: 30});
    const cohort = buildCohort({traits: ['seed'], quantity: 2});
    expect(farm.plantSpace).toEqual(1);
    expect(cohort.quantity).toEqual(2);
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(2);
    expect(newCohorts.map((cohort) => cohort.state).sort()).toEqual(['plant', 'seed']);
  });
  it ('does not plants seeds if there is not enough time in the season', () => {
    const farm = buildFarm({dayOfSeason: 20, daysLeftOverall: 25});
    const cohort = buildCohort({traits: ['seed']})
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(1);
    expect(newCohorts[0].state).toEqual('seed');
  });
  it ('does not plants seeds if there is not enough time in the simulation', () => {
    const farm = buildFarm({dayOfSeason: 1, daysLeftOverall: 1});
    const cohort = buildCohort({traits: ['seed']})
    const newCohorts = plantSeeds(cohort, farm);
    expect(newCohorts.length).toEqual(1);
    expect(newCohorts[0].state).toEqual('seed');
  });
});