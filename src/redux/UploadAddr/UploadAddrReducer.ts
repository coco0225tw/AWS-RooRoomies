import addressType from './UploadAddrType';
import { uploadAddrAction, uploadAddrActionType } from './UploadAddrAction';

const addrEmptyInitialState: addressType = {
  countyname: '臺北市',
  countycode: 63000,
  townname: '',
  completeAddr: '',
  floor: null,
  totalFloor: null,
  latLng: { lat: null, lng: null },
};

export default function UploadAddr(state = addrEmptyInitialState, action: uploadAddrActionType) {
  switch (action.type) {
    case uploadAddrAction.UPLOAD_ADDR:
      return action.payload.addrState;
    case uploadAddrAction.CLEAR_TOWN:
      return { ...state, townname: '' };
    case uploadAddrAction.RETURN_INITIAL_ADDR:
      return addrEmptyInitialState;
    default:
      return state;
  }
}
