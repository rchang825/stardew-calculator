# Crop Simulator

## Purpose
Calculate max profit by a target day given a starting scenario (seeds, crops, machines, etc)

## Overview
This simulator groups improvable items into *Cohorts* (same name, phase, age, quality, etc.) then simulates each day by aging each cohort when possible. Aspects of the environment and farm (e.g. machines and plantable space available; the day, season, and weather) are managed by the *Farm* object. Reference data about each type of crop (like days to grow and base price) are available in the *Almanac* object. The simulator returns the total sell price of the final day's cohorts.

## Cohort
A group of identical items: of the same crop, in the same phase for the same number of days. Quantity indicates number of items in the cohort. 

Example:
```
{quantity: 3, crop: "GreenBean", phase: "plant", age: 6}
```

### Attributes
- `quantity` (int): number of items in cohort
- `crop` (string): crop identifier string
- `phase` (string): phase identifier string (seed, plant, produce, jar, keg, cask)
- `age` (int): number of days cohort has been in this phase. Age resets to 0 on the day a cohort changes phases, and is 1 at the beginning of the first full day in a phase. Always 0 for phases that don't age (i.e. produce or seed).
- `quality`: (Todo: not yet implemented)

### Aging
The aging process models the *overnight* growth/improvement of crops and goods. The simulator assumes that the most profitable actions were taken during the day.

The aging process is managed by the separate CohortAger class. Aging may create additional cohorts to hold produced items or to split the cohort into different phases.

 On the first day (Day 1), a cohort of seeds (always age: 0) the simulator assume plant the seeds we have space for, and then at 2AM, we age the cohorts, and the cohort of seeds becomes plants with an age of 1, representing the state at the beginning of Day 2.

#### Aging Seeds
Seeds can be planted in plantable farm space to become plants but don't age if unplanted. Unplanted seeds remain age 0.

The aging logic only plants if there are enough days to produce at least one more time before the end of the season and simulation.

If cohort quantity is greater than plantable farm space available, the cohort must be split into a plant cohort and a seed cohort for the remaining seeds. The new plant cohort's age should be set to 1 (age 0 of the plant is the day it is planted, and modeled as a seed cohort)

#### Aging Plants
Age, produce, die
- produce if a produce day (create produce cohort)
- if single harvest
  - clear space & drop cohort
- if multiple harvest
  - keep cohort and increase age

#### Aging Produce
Produce doesn't naturally age. Requires available jar or keg.
Put in Jar or Keg. Follow rules of which produce can be put in which machine, and if enough days left in simulation.
split cohort if not enough space for all

#### Aging Jars and Kegs
Like a single harvest plant.
if reached produce day
produce (create goods cohort), clear keg/jar, drop produce cohort

#### Aging Artisan Goods
Put in cask. (following rule of what can go in cask)
If enough days left in simulation.
split cohort if not enough space for all

#### Aging Casks
Age, Improve
if an improvement day, improve quality and age of cohort
if not enough days left before next improvement
- remove good, clear machine
if enough days left before next improvement
- keep cohort and increase age

### Splitting Cohorts

## Farm

## Almanac


## Roadmap
- Fertilizer
- Skill levels and professions
- Food buffs
- Monte carlo simulation