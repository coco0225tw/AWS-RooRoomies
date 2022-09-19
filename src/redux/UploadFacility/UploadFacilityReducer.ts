import facilityType from './UploadFacilityType';
type Action =
  | { type: 'UPLOAD_FACILITY'; payload: { facilityState: facilityType } }
  | { type: 'GET_FACILITY_FROM_FIREBASE'; payload: { facilityState: facilityType } }
  | { type: 'RETURN_INITIAL_FACILITY' };

const facilityEmptyState = {
  deposit: '',
  extraFee: [],
  facility: [],
  furniture: [],
  parking: [],
  rules: [],
};
export default function UploadFacility(state = facilityEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_FACILITY':
      return action.payload.facilityState;
    case 'GET_FACILITY_FROM_FIREBASE':
      return action.payload.facilityState;
    case 'RETURN_INITIAL_FACILITY':
      return facilityEmptyState;
    default:
      return state;
  }
}
