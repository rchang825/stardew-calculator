# Crop Simulator

## Purpose
Calculate max profit earnable by a target day given a starting scenario (seeds, crops, machines, etc)

## Overview
This program simulates a number of days in Stardew Valley. Each day it greedily improves as many items as it can in order to maximize profit by the end of the simulation period.

This simulator groups improvable items into **Cohorts** (same name, phase, age, quality, etc.) then simulates each day by /aging/ each cohort when possible. Aging can be simple (increment age for a grape in a keg) or more involved (reserve plantable farm space, create cohort of plants, remove planted count from seed cohort quantity).

Aspects of the environment and farm (e.g. machines and plantable space available; the day, season, and weather) are managed by the **Farm** object. Reference data about each type of crop (like days to grow and base price) are available in the **Almanac** object. The simulator returns the total sell price of the final day's cohorts.

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

## Aging
The aging process models the **overnight** improvement of crops and goods. The simulator assumes that the most profitable actions were taken during the day. Aging may create additional cohorts to hold produced items or to split the cohort into different phases.

The aging process is managed by the separate `CohortAger` class.

### Aging Seeds
A seed can be planted in a plantable farm space (1 seed per space). This creates a new plant phase cohort, with a quantity matching the seeds planted. Seed cohorts do not age if unplanted and remain age 0.

Example: On Day 1, assuming enough farm space, a cohort of seeds is converted into a cohort of plants of the same quantity. Since the aging process simulates the **overnight** improvement of items, the plant cohort's age is set to 1 so that on Day 2 the plants have the correct age: 1 day old.

The aging logic only plants if there are enough days to produce at least one more time before the end of the simulation and season (although it skips the end-of-season check if in-season next season).  It also checks that a plant is in-season before planting. 

If there are not enough plantable farm spaces for the seed cohort, the cohort must be split. See *Splitting Cohorts*.

### Aging Plants
Plant cohorts age by incrementing their `age` until the next season. At the end of the season, the plants die and the cohort is no longer relevant, unless the crop is cross-season and supports the next season.

If the crop generates produce on the current day, the simulator creates a new cohort of produce of the same quantity as plants.

If the crop is single-harvest, the plant cohort can be deleted as it is no longer relevant. The simulator also frees up the plantable farm space.

If the crop is multi-harvest, the plant cohort is not deleted as it will continue to create produce on later days.


### Aging Produce
Produce can be inserted into a compatible machine (e.g. a keg or preserve jar), 1 produce per machine. This creates a new `keg` or `jar` phase cohort, with a quantity matching the produce inserted.  Not-in-machine produce cohorts remain age 0 and do not age, similar to seeds.

Kegs and preserve jars have separate rules for which kinds of produce are allowed to be inserted.

Produce is not inserted into machines if there are not enough days to produce an artisan good before the end of the simulation.

If there are not enough machines for the produce cohort, the cohort must be split. See *Splitting Cohorts*.

### Aging Jars and Kegs
Jar and keg cohorts age by incrementing their `age` until the artisan good is produced. The time required varies by machine and by crop.

When goods are produced, the simulator creates a new artisan good cohort of the same quantity as the machines, and deletes the machine cohort. Alternatively, the machine cohort can be re-used by updating the phase to `good` and updating the age to 0. 

The simulator frees up the the jars or kegs so that more produce can be inserted. 

### Aging Artisan Goods
Certain artisan goods can be inserted into casks, 1 good per cask, resulting in a new cask phase cohort, with a quantity matching the goods inserted.  Not-in-cask goods cohorts remain age 0 and do not age, similar to seeds and produce.

Goods are not inserted into casks if there is not enough time left in the simulation to improve the good.

If there are not enough casks for the artisan good cohort, the cohort must be split. See *Splitting Cohorts*.

### Aging Casks
Cask cohorts age by incrementing their `age` until reaching iridium quality, at which point they convert into iridium quality artisan goods.

If the cask improves the good on the current day, the simulator updates the quality of the cohort to the next quality level (normal, silver, gold, iridium).

When iridium is reached or if not enough days remain the before end of simulation to improve quality, the cohort is converted back to an artisan good cohort, and the casks are freed up for other goods. 

On the last day of the simulation, any filled casks are treated the same as an artisan good cohort of the same quality.

## Phase Processing Order
Aging plants can free up plantable farm space, which is needed by seeds, so plants are aged before seeds to avoid extra work. This also avoids potentially double-aging newly-planted plants.

Aging plants also creates produce, which can be aged immediately. So plants are aged before produce.

Aging machines can free up machines, which are needed by produce, so machines are aged before produce. This also avoids potentially double-aging newly-inserted machines.

Aging machine also creates artisan goods, which can be aged immediately. So machines are aged before artisan goods.

Aging casks can free up casks, which are needed by artisan goods, so casks are aged before artisan goods. This also avoids potentially double-aging newly-inserted casks.

In summary:
1. Plants before Seeds and Produce.
2. Jars and Kegs before Produce and Artisan Goods.
3. Casks before Artisan Goods.

## Splitting Cohorts

### Seeds
If cohort quantity is greater than plantable farm space available, the cohort must be split into a plant cohort and a seed cohort for the remaining seeds. The new plant cohort's age should be set to 1 (age 0 of the plant is the day it is planted, and modeled as a seed cohort)

### Produce
If cohort quantity is greater than machines available, the cohort must be split into a machine cohort and a produce cohort for the remaining produce. The new machine cohort's age should be set to 1 (age 0 of the machine is the day produce was inserted) so that on Day 2 the machine cohort has the correct age: 1 day old.

### Artisan Goods
If cohort quantity is greater than casks available, the cohort must be split into a cask cohort and a goods cohort for the remaining goods. The new cask cohort's age should be set to 1 (age 0 of the cask is the day good was inserted) so that on Day 2 the cask cohort has the correct age: 1 day old.

## Farm

## Almanac


## Roadmap
- Fertilizer
- Skill levels and professions
- Food buffs
- Greenhouse and Ginger Island
- Monte carlo simulation