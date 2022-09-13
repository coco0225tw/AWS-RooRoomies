import bookingTimesType from './UploadBookingTimesType';
type Action = { type: 'UPLOAD_TIMES'; payload: { selectedTimes: bookingTimesType } };

const timeEmptyState: bookingTimesType[] = [];
export default function UploadTimes(state = timeEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_TIMES':
      return action.payload.selectedTimes;
    default:
      return state;
  }
}
