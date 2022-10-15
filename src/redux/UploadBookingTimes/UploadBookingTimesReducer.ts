import { bookingTimesType } from './UploadBookingTimesType';
import { uploadBookingTimesAction, uploadBookingTimesActionType } from './UploadBookingTimesAction';

const timeEmptyState: bookingTimesType = [];
export default function UploadTimes(state = timeEmptyState, action: uploadBookingTimesActionType) {
  switch (action.type) {
    case uploadBookingTimesAction.UPLOAD_TIMES:
      return action.payload.selectedTimes;
    case uploadBookingTimesAction.ADD_TIME:
      return [...state, action.payload.time];
    case uploadBookingTimesAction.DELETE_TIME:
      return state.filter((i) => i.startTime !== action.payload.time || i.date !== action.payload.date);
    case uploadBookingTimesAction.DELETE_DATE:
      return state.filter((i) => i.date !== action.payload.date);
    case uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES:
      return timeEmptyState;
    default:
      return state;
  }
}
