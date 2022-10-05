interface bookTimeInfo {
  date: Date;
  startTime: string;
  isBooked: boolean;
}
type bookingTimesType = bookTimeInfo[];
export default bookingTimesType;
