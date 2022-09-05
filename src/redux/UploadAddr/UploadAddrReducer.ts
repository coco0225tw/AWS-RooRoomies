import addressType from './UploadAddrType';
type Action = { type: 'UPLOAD_ADDR'; payload: { addrState: addressType } };
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
    default:
      return state;
  }
}
