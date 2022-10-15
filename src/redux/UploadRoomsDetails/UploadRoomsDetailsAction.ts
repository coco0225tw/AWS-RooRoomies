import { roomDetailsType, roomType } from './UploadRoomsDetailsType';
enum uploadRoomDetailsAction {
  UPLOAD_ROOMS = 'UPLOAD_ROOMS',
  ADD_ROOM = 'ADD_ROOM',
  DELETE_ROOM = 'DELETE_ROOM',
  RETURN_INITIAL_ROOM_DETAILS = 'RETURN_INITIAL_ROOM_DETAILS',
}

interface uploadRoom {
  type: uploadRoomDetailsAction.UPLOAD_ROOMS;
  payload: { roomState: roomDetailsType };
}

interface addRoom {
  type: uploadRoomDetailsAction.ADD_ROOM;
  payload: { room: roomType };
}
interface deleteRoom {
  type: uploadRoomDetailsAction.DELETE_ROOM;
  payload: { index: number };
}
interface returnInitialRoomDetails {
  type: uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS;
}

type uploadRoomsActionType = uploadRoom | returnInitialRoomDetails | addRoom | deleteRoom;

export { uploadRoomDetailsAction, uploadRoomsActionType };
