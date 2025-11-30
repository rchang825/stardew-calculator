import { useEffect } from 'react';
import { simulate } from '../services/cropSimulator';

function CropProfitsCalculator() {

  useEffect(() => {
    simulate();
  }, []);


  return (
    <div>
      <h2>Crop Profits Calculator</h2>
    </div>
  );
}

export default CropProfitsCalculator;
