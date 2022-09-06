import React, { useState, useRef } from 'react';
import Calendar from 'react-calendar';
import DatePicker from 'react-multi-date-picker';
import '../../utils/Calendar.css';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
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

const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  //max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: #a8886b;
  padding: 10px;
  border-radius: 3px;

  /* ~~~ button styles ~~~ */
  button {
    background-color: #82542b;
    border: 0;
    color: white;
    border-radius: 50%;
    padding: 0px;
    height: 2rem;
    width: 2rem;
    // margin: 4px auto;
    margin: 4px auto;
    &:hover {
      background-color: white;
      color: black;
    }
    &:active {
      background-color: #82542b;
    }
  }
  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
    .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
    }
  }
  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: white;
  }
  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    margin: 3px;
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
      border-radius: 3px;
    }
    .react-calendar__navigation__arrow {
      // flex-grow: 0.333;
      border-radius: 3px;
    }
  }
  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;
    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }

  /* ~~~ disabled~~~ */
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
    color: gray;
  }
  .react-calendar__tile:enabled:hover {
    background-color: white;
    color: black;
    border: solid 1px #82542b;
  }
  ,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  /* ~~ highlight ~~ */
  .highlight {
    color: red;
  }
`;

const TimeInput = styled.input.attrs({
  type: 'time',
})``;

const StartTime = styled(TimeInput)``;
const EndTime = styled(TimeInput)``;
function SetBookingTimes() {
  type tileDisabledType = { date: Date };
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<{ date: { startTime: string; endTime: string }[] }>();

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
            <StartTime></StartTime>
            {/* <div>結束時間</div>
            <EndTime></EndTime> */}
            <div>選擇的時間</div>
            <div>
              日期: {s.getFullYear() + '-' + ('0' + (s.getMonth() + 1)).slice(-2) + '-' + ('0' + s.getDate()).slice(-2)}
            </div>
          </SelectedDays>
        ))}
    </Wrapper>
  );
}

export default SetBookingTimes;
