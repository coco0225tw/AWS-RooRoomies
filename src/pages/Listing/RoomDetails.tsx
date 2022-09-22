import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';
import roomDetailsType from '../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import { Title } from '../../components/ProfileTitle';
import Hr from '../../components/Hr';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  align-items: flex-start;
  width: 100%;
  // height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const RoomArea = styled.div`
  display: flex;
  //   flex-direction: column;
  justify-content: space-between;
  width: 80%;
`;
const SubTitle = styled.div`
  font-size: 28px;
  letter-spacing: 12px
  font-weight: bold;
  color: #4f5152;
  width: 100%;
`;
// const RoommatesCond
function RoomDetails(rooms: any) {
  const [room, setRoom] = useState<roomDetailsType>([]);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    // console.log(rooms?.room);
    if (rooms?.room) {
      setRoom(rooms?.room);
    }
  }, [rooms]);
  // console.log(rooms.room);
  return (
    <Wrapper>
      <Hr style={{ margin: '40px 0px' }} />
      <SubTitle>房間規格</SubTitle>
      {room &&
        room.map((r: any, index) => (
          <RoomArea key={`room${index}`}>
            <div>房間{index + 1}</div>
            <div>{r.rent}</div>
            <div>{r.sq}</div>
            <div>{r.form}</div>
            <div>{r.peopleAmount}</div>
          </RoomArea>
        ))}
    </Wrapper>
  );
}

export default RoomDetails;
