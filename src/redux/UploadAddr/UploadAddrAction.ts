import addressType from "./UploadAddrType";

enum uploadAddrAction {
  UPLOAD_ADDR = "UPLOAD_ADDR",
  RETURN_INITIAL_ADDR = "RETURN_INITIAL_ADDR",
}

interface uploadAddr {
  type: uploadAddrAction.UPLOAD_ADDR;
  payload: { addrState: addressType };
}
interface returnInitialAddr {
  type: uploadAddrAction.RETURN_INITIAL_ADDR;
}

type uploadAddrActionType = uploadAddr | returnInitialAddr;
export { uploadAddrAction, uploadAddrActionType };
