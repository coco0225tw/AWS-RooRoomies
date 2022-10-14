import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Hr from '../../components/Hr';
import { roomDetailsType, roomType } from '../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: auto;
`;

const SubTitle = styled.div`
  font-size: 28px;
  color: #4f5152;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  font-size: 16px;
`;

const Td = styled.td`
  text-align: center;
  padding: 8px 4px;
`;
const Tr = styled.tr``;

function RoomDetails({ rooms }: { rooms: roomDetailsType }) {
  const [room, setRoom] = useState<roomDetailsType>([]);

  useEffect(() => {
    if (rooms) {
      setRoom(rooms);
    }
  }, [rooms]);

  return (
    <Wrapper>
      <Hr style={{ margin: '40px 0px' }} />
      <SubTitle style={{ marginBottom: '32px' }}>房間規格</SubTitle>
      <Table style={{ border: 'solid 1px #ece2d5' }}>
        <Tr style={{ borderBottom: ' solid 1px #ece2d5 ' }}>
          <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }} />
          <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>價錢</Td>
          <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>坪數</Td>
          <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>規格</Td>
          <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>入住人數</Td>
        </Tr>
        {room &&
          room.map((r: roomType, index) => (
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
