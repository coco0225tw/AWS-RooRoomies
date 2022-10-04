import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import roommatesConditionType from "../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import facilityType from "../../redux/UploadFacility/UploadFacilityType";
import roomDetailsType from "../../redux/UploadRoomsDetails/UploadRoomsDetailsType";
import { Title } from "../../components/ProfileTitle";
import Hr from "../../components/Hr";
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

const Table = styled.table`
  width: 100%;
  font-size: 16px;
`;
const Th = styled.th`
  padding: 4px;
`;
const Tbody = styled.tbody``;
const Td = styled.td`
  text-align: center;
  padding: 8px 4px;
`;
const Tr = styled.tr``;
function RoomDetails(rooms: any) {
  const [room, setRoom] = useState<roomDetailsType>([]);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    if (rooms?.room) {
      setRoom(rooms?.room);
    }
  }, [rooms]);

  return (
    <Wrapper>
      <Hr style={{ margin: "40px 0px" }} />
      <SubTitle style={{ marginBottom: "32px" }}>房間規格</SubTitle>
      <Table style={{ border: "solid 1px #ece2d5" }}>
        <Tr style={{ borderBottom: " solid 1px #ece2d5 " }}>
          <Td style={{ borderBottom: " solid 1px #ece2d5 " }}></Td>
          <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>價錢</Td>
          <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>坪數</Td>
          <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>規格</Td>
          <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>入住人數</Td>
        </Tr>
        {room &&
          room.map((r: any, index) => (
            // <RoomArea key={`room${index}`}>
            <Tr key={`room${index}`}>
              <Td>房間{index + 1}</Td>
              <Td>{r.rent}元</Td>
              <Td>{r.sq}坪</Td>
              <Td>{r.form}</Td>
              <Td>{r.peopleAmount}人</Td>
            </Tr>
          ))}
      </Table>
    </Wrapper>
  );
}

export default RoomDetails;
