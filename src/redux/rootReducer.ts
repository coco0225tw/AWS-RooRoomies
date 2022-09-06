import { combineReducers } from 'redux';
import UploadAddr from './UploadAddr/UploadAddrReducer';
import UploadRoommatesCondition from './UploadRoommatesCondition/UploadRoommatesConditionReducer';
import UploadFacility from './UploadFacility/UploadFacilityReducer';

const rootReducer = combineReducers({
  UploadAddrReducer: UploadAddr,
  UploadRoommatesConditionReducer: UploadRoommatesCondition,
  UploadFacilityReducer: UploadFacility,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
