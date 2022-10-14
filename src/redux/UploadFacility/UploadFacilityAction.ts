import facilityType from './UploadFacilityType';

enum uploadFacilityAction {
  UPLOAD_FACILITY = 'UPLOAD_FACILITY',
  GET_FACILITY_FROM_FIREBASE = 'GET_FACILITY_FROM_FIREBASE',
  RETURN_INITIAL_FACILITY = 'RETURN_INITIAL_FACILITY',
}

interface uploadFacility {
  type: uploadFacilityAction.UPLOAD_FACILITY;
  payload: { facilityState: facilityType };
}
interface getFacilityFromFirebase {
  type: uploadFacilityAction.GET_FACILITY_FROM_FIREBASE;
  payload: { facilityState: facilityType };
}
interface returnInitialFacility {
  type: uploadFacilityAction.RETURN_INITIAL_FACILITY;
}

type uploadFacilityActionType = uploadFacility | getFacilityFromFirebase | returnInitialFacility;
export { uploadFacilityAction, uploadFacilityActionType };
