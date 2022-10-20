import { bookingTimesType } from './UploadBookingTimesType';
import { uploadBookingTimesAction, uploadBookingTimesActionType } from './UploadBookingTimesAction';

const timeEmptyState: bookingTimesType = [];
export default function UploadTimes(state = timeEmptyState, action: uploadBookingTimesActionType) {
  switch (action.type) {
    case uploadBookingTimesAction.UPLOAD_TIMES:
      return action.payload.selectedTimes;
    case uploadBookingTimesAction.ADD_TIME: {
      let newState = [...state, action.payload.time];
      return newState;
    }
    case uploadBookingTimesAction.DELETE_TIME: {
      let newState = state.filter((i) => i.startTime !== action.payload.time || i.date !== action.payload.date);
      return newState;
    }
    case uploadBookingTimesAction.DELETE_DATE: {
      let newState = state.filter((i) => i.date !== action.payload.date);
      return newState;
    }
    case uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES:
      return timeEmptyState;
    default:
      return state;
  }
}
