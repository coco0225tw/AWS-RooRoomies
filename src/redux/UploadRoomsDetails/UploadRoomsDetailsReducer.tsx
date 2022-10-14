import { roomDetailsType } from './UploadRoomsDetailsType';
type Action =
  | { type: 'UPLOAD_ROOMS'; payload: { roomState: roomDetailsType } }
  | { type: 'RETURN_INITIAL_ROOM_DETAILS' };

const roomEmptyState: [] = [];
export default function UploadRooms(state = roomEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_ROOMS':
      return action.payload.roomState;
    case 'RETURN_INITIAL_ROOM_DETAILS':
      return roomEmptyState;
    default:
      return state;
  }
}
