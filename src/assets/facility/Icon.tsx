import administrator from './administrator.png';
import airConditioner from './airConditioner.png';
import bed from './bed.png';
import bedding from './bedding.png';
import chair from './chair.png';
import cleanFee from './cleanFee.png';
import deposit from './deposit.png';
import electricFee from './electricFee.png';
import elevator from './elevator.png';
import extinguisher from './extinguisher.png';
import floor from './floor.png';
import fogDetector from './fogDetector.png';
import fridge from './fridge.png';
import garbage from './garbage.png';
import gender from './gender.png';
import house from './house.png';
import kitchen from './kitchen.png';
import liquifiedGas from './liquifiedGas.png';
import managementFee from './managementFee.png';
import natureGas from './naturalGas.png';
import pet from './pet.png';
import sofa from './sofa.png';
import sq from './sq.png';
import stove from './stove.png';
import table from './table.png';
import wardrobe from './wardrobe.png';
import washingMachine from './washingMachine.png';
import waterFee from './waterFee.png';
import waterHeater from './waterHeater.png';
import wifi from './wifi.png';

const Icons = {
  deposit,
  floor,
  sq,
  fire: stove,
  pet,
  extraFee: {
    administratorFee: administrator,
    cleanFee,
    electricFee,
    managementFee,
    waterFee,
    wifiFee: wifi,
    gasFee: stove,
  },
  facility: {
    garbage,

    fridge,
    elevator,
    fogDetector,
    extinguisher,
    natureGas,
    liquifiedGas,
    waterHeater,
    kitchen,
    washingMachine,
    wifi,
  },
  furniture: {
    sofa,
    wardrobe,
    airConditioner,
    bed,
    bedding,
    table,
    chair,
  },
};

export default Icons;
