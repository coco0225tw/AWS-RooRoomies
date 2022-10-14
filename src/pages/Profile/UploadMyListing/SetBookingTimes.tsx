import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import CalendarContainer from '../../../components/Calendar';
import { SubTitle } from '../../../components/ProfileTitle';
import { BtnDiv } from '../../../components/Button';
import { RootState } from '../../../redux/rootReducer';
import bin from '../../../assets/bin.png';
import { bookingTimesType, bookTimeType } from '../../../redux/UploadBookingTimes/UploadBookingTimesType';
import { uploadBookingTimesAction } from '../../../redux/UploadBookingTimes/UploadBookingTimesAction';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  color: #4f5152;
`;

const SelectedDays = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`;
const SelectedDay = styled.div``;
const SelectTimes = styled.div`
  display: flex;
  flex-direction: column;
  width: 84px;
`;
const AddTimeBtn = styled.div`
  cursor: pointer;
  background-color: grey;
  color: white;
`;

const TimeInput = styled.input.attrs({
  type: 'time',
})`
  accent-color: #c77155;
`;
const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
`;
const SectionWrapper = styled.div`
  flex-basis: 54%;
`;
const StartTime = styled(TimeInput)``;

const SectionDivider = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
`;
const SelectTime = styled.div`
  display: flex;
  padding: 0 8px 8px;
  width: 84px;
`;
const Cross = styled.div`
  background-image: url(${bin});
  background-size: 20px 20px;
  width: 20px;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
function SetBookingTimes({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const timesInfo = useSelector((state: RootState) => state.UploadTimesReducer) as bookingTimesType;
  const [selectedDays, setSelectedDays] = useState<Date[]>(
    timesInfo
      .map((d: bookTimeType, index: number) => d.date)
      .reduce((acc: Date[], curr: Date) => {
        let findIndex = acc.findIndex((item: Date) => item === curr);
        if (findIndex === -1) {
          acc.push(curr);
        } else {
        }
        return acc;
      }, [])
  );
  const [selectedTimes, setSelectedTimes] = useState<bookingTimesType>(timesInfo);
  const selectedTimeRef = useRef<HTMLInputElement[]>([]);

  type tileDisabledType = { date: Date };
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
    setSelectedDays((prev) => [...prev, date]);
  }

  function clickTime(date: Date, index: number) {
    const time = {
      date: date,
      startTime: selectedTimeRef.current[index]?.value,
      isBooked: false,
    };

    setSelectedTimes([
      ...(selectedTimes as {
        date: Date;
        startTime: string;
        isBooked: boolean;
      }[]),
      time,
    ]);
  }

  function deleteTime(date: Date, time: string) {}
  function deleteDay(date: Date) {
    setSelectedDays(selectedDays.filter((i) => i !== date));
    setSelectedTimes(selectedTimes.filter((i) => i.date !== date));
  }
  function submit(selectedTimes: bookingTimesType) {
    dispatch({
      type: uploadBookingTimesAction.UPLOAD_TIMES,
      payload: { selectedTimes },
    });
  }
  return (
    <Wrapper>
      <SectionDivider>
        <CalendarContainer style={{ marginLeft: '0', marginBottom: '12px' }}>
          <Calendar onClickDay={clickDate} selectRange={false} tileDisabled={tileDisabled} />
        </CalendarContainer>
        <SectionWrapper>
          <SubTitle style={{ marginBottom: '12px' }}>選擇的日期</SubTitle>
          {selectedDays &&
            selectedDays.map((s, index) => (
              <SelectedDays key={`selectedDays${index}`}>
                <SelectedDay>
                  {s.getFullYear() + '-' + ('0' + (s.getMonth() + 1)).slice(-2) + '-' + ('0' + s.getDate()).slice(-2)}
                </SelectedDay>
                <StartTime ref={(el) => ((selectedTimeRef.current[index] as HTMLInputElement) = el)}></StartTime>
                <SubmitBtn
                  style={{ marginTop: '0px' }}
                  onClick={() => {
                    clickTime(s, index);
                  }}
                >
                  加入時間
                </SubmitBtn>
                <SelectTimes>
                  {selectedTimes &&
                    selectedTimes
                      .filter((t) => t.date === s)
                      .map((time, index) => (
                        <SelectTime key={`selectedTimes${index}`}>
                          <div>{time.startTime}</div>
                          <Cross onClick={() => deleteTime(time.date, time.startTime)} />
                        </SelectTime>
                      ))}
                </SelectTimes>
                <Cross onClick={() => deleteDay(s)} />
              </SelectedDays>
            ))}
        </SectionWrapper>
      </SectionDivider>
      <SubmitBtn
        onClick={() => {
          submit(selectedTimes);
          setClickTab('設定室友條件');
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default SetBookingTimes;
