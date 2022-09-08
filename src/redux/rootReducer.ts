import { combineReducers } from 'redux';
import UploadAddr from './UploadAddr/UploadAddrReducer';
import UploadRoommatesCondition from './UploadRoommatesCondition/UploadRoommatesConditionReducer';
import UploadFacility from './UploadFacility/UploadFacilityReducer';
import UploadTitle from './UploadTitle/UploadTitleReducer';
import UploadImages from './UploadMainImageAndImages/UploadMainImageAndImagesReducer';
import UploadRooms from './UploadRoomsDetails/UploadRoomsDetailsReducer';
import UploadTimes from './UploadBookingTimes/UploadBookingTimesReducer';

const rootReducer = combineReducers({
  UploadAddrReducer: UploadAddr,
  UploadRoommatesConditionReducer: UploadRoommatesCondition,
  UploadFacilityReducer: UploadFacility,
  UploadTitleReducer: UploadTitle,
  UploadImagesReducer: UploadImages,
  UploadRoomsReducer: UploadRooms,
  UploadTimesReducer: UploadTimes,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
