import addressType from './UploadAddrType';
type Action = { type: 'UPLOAD_ADDR'; payload: { addrState: addressType } } | { type: 'RETURN_INITIAL_ADDR' };
const addrEmptyInitialState = {
  countyname: '',
  townname: '',
  roadOrStreetNameOrVillage: '',
  roadSection: '',
  lane: '',
  alley: '',
  number: '',
  floor: '',
};

export default function UploadAddr(state = addrEmptyInitialState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_ADDR':
      return action.payload.addrState;
    case 'RETURN_INITIAL_ADDR':
      return addrEmptyInitialState;
    default:
      return state;
  }
}
