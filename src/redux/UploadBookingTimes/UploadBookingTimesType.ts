interface bookTimeType {
  date: Date;
  startTime: string;
  isBooked: boolean;
}
type bookingTimesType = bookTimeType[];
export { bookingTimesType, bookTimeType };
