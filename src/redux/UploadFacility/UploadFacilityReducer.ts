import facilityType from './UploadFacilityType';
import { uploadFacilityAction, uploadFacilityActionType } from './UploadFacilityAction';

const facilityEmptyState = {
  deposit: '',
  extraFee: [],
  facility: [],
  furniture: [],
  parking: [],
  rules: [],
} as facilityType;
export default function UploadFacility(state = facilityEmptyState, action: uploadFacilityActionType) {
  switch (action.type) {
    case uploadFacilityAction.UPLOAD_FACILITY:
      return action.payload.facilityState;
    case uploadFacilityAction.GET_FACILITY_FROM_FIREBASE:
      return action.payload.facilityState;
    case uploadFacilityAction.RETURN_INITIAL_FACILITY:
      return facilityEmptyState;
    default:
      return state;
  }
}
