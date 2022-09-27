import bookingTimesType from "./UploadBookingTimesType";
type Action =
  | { type: "UPLOAD_TIMES"; payload: { selectedTimes: bookingTimesType } }
  | { type: "RETURN_INITIAL_BOOKINGTIMES" };

const timeEmptyState: bookingTimesType[] = [];
export default function UploadTimes(state = timeEmptyState, action: Action) {
  switch (action.type) {
    case "UPLOAD_TIMES":
      console.log(action.payload.selectedTimes);
      return action.payload.selectedTimes;
    case "RETURN_INITIAL_BOOKINGTIMES":
      return timeEmptyState;
    default:
      return state;
  }
}
