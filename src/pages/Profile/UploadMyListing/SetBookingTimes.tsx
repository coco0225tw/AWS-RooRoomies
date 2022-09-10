import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import DatePicker from 'react-multi-date-picker';
import styled from 'styled-components';
import bookingTimesType from '../../../redux/UploadBookingTimes/UploadBookingTimesType';
import CalendarContainer from '../../../components/Calendar';
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

// const CalendarContainer = styled.div`
//   /* ~~~ container styles ~~~ */
//   //max-width: 600px;
//   margin: auto;
//   margin-top: 20px;
//   background-color: #a8886b;
//   padding: 10px;
//   border-radius: 3px;

//   /* ~~~ button styles ~~~ */
//   button {
//     background-color: #82542b;
//     border: 0;
//     color: white;
//     border-radius: 50%;
//     padding: 0px;
//     height: 2rem;
//     width: 2rem;
//     // margin: 4px auto;
//     margin: 4px auto;
//     &:hover {
//       background-color: white;
//       color: black;
//     }
//     &:active {
//       background-color: #82542b;
//     }
//   }
//   /* ~~~ day grid styles ~~~ */
//   .react-calendar__month-view__days {
//     display: grid !important;
//     grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

//     .react-calendar__tile {
//       max-width: initial !important;
//     }
//     .react-calendar__tile--range {
//       box-shadow: 0 0 6px 2px black;
//     }
//   }
//   /* ~~~ neighboring month & weekend styles ~~~ */
//   .react-calendar__month-view__days__day--neighboringMonth {
//     opacity: 0.7;
//   }
//   .react-calendar__month-view__days__day--weekend {
//     color: white;
//   }
//   /* ~~~ navigation styles ~~~ */
//   .react-calendar__navigation {
//     margin: 3px;
//     display: flex;

//     .react-calendar__navigation__label {
//       font-weight: bold;
//       border-radius: 3px;
//     }
//     .react-calendar__navigation__arrow {
//       // flex-grow: 0.333;
//       border-radius: 3px;
//     }
//   }
//   /* ~~~ label styles ~~~ */
//   .react-calendar__month-view__weekdays {
//     text-align: center;
//   }
//   /* ~~~ other view styles ~~~ */
//   .react-calendar__year-view__months,
//   .react-calendar__decade-view__years,
//   .react-calendar__century-view__decades {
//     display: grid !important;
//     grid-template-columns: 20% 20% 20% 20% 20%;
//     &.react-calendar__year-view__months {
//       grid-template-columns: 33.3% 33.3% 33.3%;
//     }

//     .react-calendar__tile {
//       max-width: initial !important;
//     }
//   }

//   /* ~~~ disabled~~~ */
//   .react-calendar__tile:disabled {
//     background-color: #f0f0f0;
//     color: gray;
//   }
//   .react-calendar__tile:enabled:hover {
//     background-color: white;
//     color: black;
//     border: solid 1px #82542b;
//   }
//   ,
//   .react-calendar__tile:enabled:focus {
//     background-color: #e6e6e6;
//   }

//   /* ~~ highlight ~~ */
//   .highlight {
//     color: red;
//   }
// `;
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
      <h2>選擇時間</h2>
      <CalendarContainer>
        <Calendar onClickDay={clickDate} selectRange={false} tileDisabled={tileDisabled} />
      </CalendarContainer>
      <div>選擇的日期</div>
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
