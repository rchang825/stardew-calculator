export function buildCohort({traits = [], quantity = null, crop = null, state = null, age = null} = {}) {
  const newCohort = {quantity: 1, crop: 'hops', state: 'plant', age: 1};
  for (const trait of traits) {
    switch(trait) {
      case 'seed':
        newCohort.state = 'seed';
        newCohort.age = 0;
        break;
      case 'produce':
        newCohort.state = 'produce';
        break;
      case 'jar':
        newCohort.state = 'jar';
        break;
      case 'keg':
        newCohort.state = 'keg';
        break;
      case 'cask':
        newCohort.state = 'cask';
        break;
      default:
        break;
    }
  }

  const params =  {quantity: quantity, crop: crop, state: state, age: age};
  const nonNullParams = Object.keys(params).reduce((acc, key) => {
    if (params[key] !== null && params[key] !== undefined) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  Object.assign(newCohort, nonNullParams);
  return newCohort;
}