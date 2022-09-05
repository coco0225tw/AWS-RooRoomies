import { combineReducers } from 'redux';
import UploadAddr from './UploadAddr/UploadAddrReducer';
import UploadRoommatesCondition from './UploadRoommatesCondition/UploadRoommatesConditionReducer';
const rootReducer = combineReducers({
  UploadAddrReducer: UploadAddr,
  UploadRoommatesConditionReducer: UploadRoommatesCondition,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
