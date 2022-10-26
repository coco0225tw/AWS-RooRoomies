interface bookTimeType {
  date: Date;
  startTime: string;
  isBooked: boolean;
}
interface bookingTimesType extends Array<bookTimeType> {}
export { bookingTimesType, bookTimeType };
