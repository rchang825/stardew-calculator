import React, { useState, useEffect } from 'react';
import crops from '../../data.js';

function QuantityNeededCalculator() {
  const [cropName, setCropName] = useState('');
  const [desiredQuantity, setDesiredQuantity] = useState('');
  const [daysLeft, setDaysLeft] = useState('');
  const [advice, setAdvice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [plotsNeeded, setPlotsNeeded] = useState('');

  function handleCalculate(event) {
    event.preventDefault();
    setErrorMsg('');
    setAdvice('');
    setPlotsNeeded('');

    const crop = crops[cropName];
    if (crop) {
      const growthTime = crop.daysToGrow;
      if (growthTime > daysLeft) {
        setErrorMsg(`It is not possible to grow ${cropName} in the remaining ${daysLeft} days.`);
      } else {
        let calculatedPlotsNeeded;
        if (crop.regrowthTime > 0) {
          const cycles = (daysLeft - growthTime) / crop.regrowthTime + 1;
          calculatedPlotsNeeded = Math.ceil(desiredQuantity / cycles);
        } else {
          calculatedPlotsNeeded = Math.ceil(desiredQuantity / Math.floor(daysLeft / growthTime));
        }
        setPlotsNeeded(calculatedPlotsNeeded);
        setAdvice(`To guarantee your goal of ${desiredQuantity} ${cropName}(s) in ${daysLeft} days,
          you will need ${calculatedPlotsNeeded} plot(s) of land.`);
      }
    } else {
      setErrorMsg(`Crop "${cropName}" not found. Please enter a valid crop name.`);
    }
  }
  function handleReset(event) {
    event.preventDefault();
    setCropName('');
    setDesiredQuantity('');
    setDaysLeft('');
    setPlotsNeeded('');
    setAdvice('');
  }

  return (
    <div>
      <h2>Quantity Needed Calculator</h2>
      <div>
        {`Crops supported: ${Object.keys(crops).map((crop) => crops[crop].name).join(', ')}`}
      </div>
      <div>
        <form>
          <label>
            Crop Name:
            <input type="text" name="cropName" value={cropName} onChange={(e) => setCropName(e.target.value)} />
          </label>
          <br />
          <label>
            Desired Quantity:
            <input type="number" name="desiredQuantity" value={desiredQuantity} onChange={(e) => setDesiredQuantity(Number(e.target.value))} />
          </label>
          <br />
          <label>
            Days Left:
            <input type="number" name="daysLeft" value={daysLeft} onChange={(e) => setDaysLeft(Number(e.target.value))} />
          </label>
          <br />
          <button onClick={handleCalculate}>Calculate</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </form>
        <div>
          {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
          {plotsNeeded && <div>{advice}</div>}
        </div>
      </div>
    </div>
  );
}

export default QuantityNeededCalculator;
