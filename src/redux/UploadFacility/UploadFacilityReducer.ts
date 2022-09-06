import facilityType from './UploadFacilityType';
type Action = { type: 'UPLOAD_FACILITY'; payload: { facilityState: facilityType } };

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
    default:
      return state;
  }
}
