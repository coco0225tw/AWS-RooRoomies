import { roomDetailsType } from './UploadRoomsDetailsType';
enum uploadRoomDetailsAction {
  UPLOAD_ROOMS = 'UPLOAD_ROOMS',
  RETURN_INITIAL_ROOM_DETAILS = 'RETURN_INITIAL_ROOM_DETAILS',
}

interface uploadRoom {
  type: uploadRoomDetailsAction.UPLOAD_ROOMS;
  payload: { roomState: roomDetailsType };
}

interface returnInitialRoomDetails {
  type: uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS;
}

type uploadRoomsActionType = uploadRoom | returnInitialRoomDetails;

export { uploadRoomDetailsAction, uploadRoomsActionType };
