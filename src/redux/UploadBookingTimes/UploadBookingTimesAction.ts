import { bookingTimesType, bookTimeType } from './UploadBookingTimesType';
enum uploadBookingTimesAction {
  UPLOAD_TIMES = 'UPLOAD_TIMES',
  ADD_TIME = 'ADD_TIME',
  DELETE_TIME = 'DELETE_TIME',
  DELETE_DATE = 'DELETE_DATE',
  RETURN_INITIAL_BOOKING_TIMES = 'RETURN_INITIAL_BOOKING_TIMES',
}

interface uploadTimes {
  type: uploadBookingTimesAction.UPLOAD_TIMES;
  payload: { selectedTimes: bookingTimesType };
}
interface addTime {
  type: uploadBookingTimesAction.ADD_TIME;
  payload: { time: bookTimeType };
}
interface deleteTime {
  type: uploadBookingTimesAction.DELETE_TIME;
  payload: { date: Date; time: string };
}
interface deleteDate {
  type: uploadBookingTimesAction.DELETE_DATE;
  payload: { date: Date };
}
interface returnInitialBookingTimes {
  type: uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES;
}

type uploadBookingTimesActionType = uploadTimes | addTime | deleteTime | deleteDate | returnInitialBookingTimes;
export { uploadBookingTimesAction, uploadBookingTimesActionType };
