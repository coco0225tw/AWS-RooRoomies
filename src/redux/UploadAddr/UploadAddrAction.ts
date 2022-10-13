import addressType from './UploadAddrType';

enum uploadAddrAction {
  UPLOAD_ADDR = 'UPLOAD_ADDR',
  CLEAR_TOWN = 'CLEAR_TOWN',
  RETURN_INITIAL_ADDR = 'RETURN_INITIAL_ADDR',
}

interface uploadAddr {
  type: uploadAddrAction.UPLOAD_ADDR;
  payload: { addrState: addressType };
}
interface clearTown {
  type: uploadAddrAction.CLEAR_TOWN;
}
interface returnInitialAddr {
  type: uploadAddrAction.RETURN_INITIAL_ADDR;
}

type uploadAddrActionType = uploadAddr | returnInitialAddr | clearTown;
export { uploadAddrAction, uploadAddrActionType };
