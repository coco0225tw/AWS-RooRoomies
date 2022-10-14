import { bookingTimesType } from './UploadBookingTimesType';
enum uploadBookingTimesAction {
  UPLOAD_TIMES = 'UPLOAD_TIMES',
  RETURN_INITIAL_BOOKING_TIMES = 'RETURN_INITIAL_BOOKING_TIMES',
}

interface uploadTimes {
  type: uploadBookingTimesAction.UPLOAD_TIMES;
  payload: { selectedTimes: bookingTimesType };
}

interface returnInitialBookingTimes {
  type: uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES;
}

type uploadBookingTimesActionType = uploadTimes | returnInitialBookingTimes;
export { uploadBookingTimesAction, uploadBookingTimesActionType };
