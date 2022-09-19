import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import DatePicker from 'react-multi-date-picker';
import styled from 'styled-components';
import bookingTimesType from '../../../redux/UploadBookingTimes/UploadBookingTimesType';
import CalendarContainer from '../../../components/Calendar';
import { SubTitle } from '../../../components/ProfileTitle';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background-color: lightgrey;
`;

const SelectedDays = styled.div`
  display: flex;
`;
const SelectedDay = styled.div`
  width: 20vh;
`;

const AddTimeBtn = styled.div`
  cursor: pointer;
  background-color: grey;
  color: white;
`;

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  &:hover {
    background-color: #222;
  }
`;
const TimeInput = styled.input.attrs({
  type: 'time',
})``;

const StartTime = styled(TimeInput)``;
const EndTime = styled(TimeInput)``;
function SetBookingTimes() {
  const dispatch = useDispatch();
  type tileDisabledType = { date: Date };
  // type bookingTimesType = { date: Date; startTime: string }[];
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<bookingTimesType>([]);
  // const [selectedTimes, setSelectedTimes] = useState<{ date: Date; startTime: string }[]>(
  //   Array(selectedDays.length).fill(undefined)
  // );
  // const selectedTimeRef = useRef<HTMLInputElement>(null);
  const selectedTimeRef = useRef<HTMLInputElement[]>([]);
  const tileDisabled = ({ date }: tileDisabledType) => {
    return (
      date < new Date() ||
      selectedDays.some(
        (disabledDate) =>
          date.getFullYear() === disabledDate.getFullYear() &&
          date.getMonth() === disabledDate.getMonth() &&
          date.getDate() === disabledDate.getDate()
      )
    );
  };

  function clickDate(date: Date) {
    window.alert(`確定選擇${date}`);
    setSelectedDays((prev) => [...prev, date]);
  }

  function clickTime(date: Date, index: number) {
    const startTime = { startTime: '123' };

    const time = { date: date, startTime: selectedTimeRef.current[index]?.value, isBooked: false };
    const generatedDate =
      date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    setSelectedTimes([...(selectedTimes as { date: Date; startTime: string; isBooked: boolean }[]), time]);
  }
  function submit(selectedTimes: bookingTimesType) {
    dispatch({ type: 'UPLOAD_TIMES', payload: { selectedTimes } });
    console.log('送出時間');
  }
  return (
    <Wrapper>
      <SubTitle>選擇時間</SubTitle>
      <CalendarContainer>
        <Calendar onClickDay={clickDate} selectRange={false} tileDisabled={tileDisabled} />
      </CalendarContainer>
      <SubTitle>選擇的日期</SubTitle>
      {selectedDays &&
        selectedDays.map((s, index) => (
          <SelectedDays key={`selectedDays${index}`}>
            <SelectedDay>
              {s.getFullYear() + '-' + ('0' + (s.getMonth() + 1)).slice(-2) + '-' + ('0' + s.getDate()).slice(-2)}
            </SelectedDay>
            <div>開始時間</div>
            <StartTime ref={(el) => ((selectedTimeRef.current[index] as any) = el)}></StartTime>
            <SubmitBtn onClick={() => clickTime(s, index)}>加入時間</SubmitBtn>
            <div>選擇的時間</div>
            {selectedTimes &&
              selectedTimes
                .filter((t) => t.date === s)
                .map((s, index) => <div key={`selectedTimes${index}`}>{s.startTime}</div>)}
          </SelectedDays>
        ))}
      {/* {selectedDays && <StartTime ref={selectedTimeRef}></StartTime>} */}

      <SubmitBtn onClick={() => submit(selectedTimes)}>儲存</SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default SetBookingTimes;
