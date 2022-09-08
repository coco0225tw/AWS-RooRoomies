import roomDetailsType from './UploadRoomsDetailsType';
type Action = { type: 'UPLOAD_ROOMS'; payload: { roomState: roomDetailsType } };

const roomEmptyState = [];
export default function UploadRooms(state = [], action: Action) {
  switch (action.type) {
    case 'UPLOAD_ROOMS':
      return action.payload.roomState;
    default:
      console.log('default');
      return state;
  }
}
