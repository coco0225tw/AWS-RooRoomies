import bookingTimesType from "./UploadBookingTimesType";
import {
  uploadBookingTimesAction,
  uploadBookingTimesActionType,
} from "./UploadBookingTimesAction";

const timeEmptyState: bookingTimesType[] = [];
export default function UploadTimes(
  state = timeEmptyState,
  action: uploadBookingTimesActionType
) {
  switch (action.type) {
    case uploadBookingTimesAction.UPLOAD_TIMES:
      return action.payload.selectedTimes;
    case uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES:
      return timeEmptyState;
    default:
      return state;
  }
}
