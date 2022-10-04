import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/rootReducer";
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormControl,
} from "../../../components/InputArea";
import { BtnDiv } from "../../../components/Button";
import bin from "../../../assets/bin.png";
import roomDetailsType from "../../../redux/UploadRoomsDetails/UploadRoomsDetailsType";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Table = styled.table`
  width: 100%;
  font-size: 16px;
`;

const Td = styled.td`
  text-align: center;
  padding: 8px 4px;
`;

const Cross = styled.div`
  background-image: url(${bin});
  background-size: 20px 20px;
  width: 100%;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
const Tr = styled.tr``;
const rentRoomDetailsFormGroups = [
  { label: "月租", key: "rent" },
  { label: "大小(坪)", key: "sq" },
  { label: "規格", key: "form" },
  { label: "人數", key: "peopleAmount" },
];
function RentRoomDetails({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();

  const roomInfo = useSelector((state: RootState) => state.UploadRoomsReducer);
  const [roomState, setRoomState] = useState<roomDetailsType>(roomInfo);

  const roomRef = useRef<HTMLInputElement[]>([]);

  function addRooms() {
    let room = {
      rent: Number(roomRef.current[0].value) as number,
      sq: roomRef.current[1].value as string,
      form: roomRef.current[2].value as string,
      peopleAmount: Number(roomRef.current[3].value) as number,
    };
    setRoomState([...roomState, room]);
    roomRef.current[0].value = "";
    roomRef.current[1].value = "";
    roomRef.current[2].value = "";
    roomRef.current[3].value = "";
  }
  function submit(roomState: roomDetailsType) {
    dispatch({ type: "UPLOAD_ROOMS", payload: { roomState } });
  }
  function deleteRoom(index: number) {
    setRoomState(roomState.filter((el, i) => i !== index));
  }
  return (
    <Wrapper>
      <InputArea>
        {rentRoomDetailsFormGroups.map((r, index) => (
          <FormGroup style={{ width: "25%", paddingRight: "12px" }} key={r.key}>
            <FormLabel>{r.label}</FormLabel>
            <FormInputWrapper>
              <FormControl
                ref={(el) => ((roomRef.current[index] as any) = el)}
                type="input"
              />
            </FormInputWrapper>
          </FormGroup>
        ))}
      </InputArea>
      <SubmitBtn style={{ marginBottom: "12px" }} onClick={() => addRooms()}>
        加入房間
      </SubmitBtn>

      {roomState.length !== 0 && (
        <Table style={{ border: "solid 1px #ece2d5" }}>
          <Tr style={{ borderBottom: " solid 1px #ece2d5 " }}>
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }} />
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>價錢</Td>
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>坪數</Td>
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>規格</Td>
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>入住人數</Td>
            <Td style={{ borderBottom: " solid 1px #ece2d5 " }}>刪除</Td>
          </Tr>
          {roomState.map((r: any, index: number) => (
            // <RoomArea key={`room${index}`}>
            <Tr key={`room${index}`}>
              <Td>房間{index + 1}</Td>
              <Td>{r.rent}元</Td>
              <Td>{r.sq}坪</Td>
              <Td>{r.form}</Td>
              <Td>{r.peopleAmount}人</Td>
              <Td>
                <Cross onClick={() => deleteRoom(index)} />
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      {/* <RoomCards>
        {roomState.map((el, index) => (
          <RoomCard key={`room${index}`}>
            <div>{el.rent}</div>
            <div>{el.sq}</div>
            <div>{el.form}</div>
            <div>{el.peopleAmount}</div>
          </RoomCard>
        ))}
      </RoomCards> */}

      <SubmitBtn
        onClick={() => {
          submit(roomState);
          setClickTab("設定看房時間");
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default RentRoomDetails;
