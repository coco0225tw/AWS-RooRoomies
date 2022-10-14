import { roomDetailsType } from './UploadRoomsDetailsType';
import { uploadRoomDetailsAction, uploadRoomsActionType } from './UploadRoomsDetailsAction';

const roomEmptyState: roomDetailsType = [];
export default function UploadRooms(state = roomEmptyState, action: uploadRoomsActionType) {
  switch (action.type) {
    case uploadRoomDetailsAction.UPLOAD_ROOMS:
      return action.payload.roomState;
    case uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS:
      return roomEmptyState;
    default:
      return state;
  }
}
