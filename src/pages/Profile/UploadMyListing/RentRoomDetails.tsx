import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { firebase } from '../../../utils/firebase';
import UploadMyListing from './UploadMyListing';
import roomDetailsType from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import { SubTitle } from '../../../components/ProfileTitle';
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../../components/InputArea';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

// const FormLegend = styled.legend`
//   line-height: 19px;
//   font-size: 16px;
//   font-weight: bold;
//   color: #3f3a3a;
//   padding-bottom: 16px;
//   border-bottom: 1px solid #3f3a3a;
//   width: 100%;
// `;
// const FormGroup = styled.div`
//   display: flex;
//   align-items: center;
//   //   flex-wrap: wrap;
//   margin-top: 30px;
//   width: 684px;

//   ${FormLegend} + & {
//     margin-top: 25px;
//   }

//   @media screen and (max-width: 1279px) {
//     line-height: 17px;
//     font-size: 14px;
//     margin-top: 20px;
//     width: 100%;

//     ${FormLegend} + & {
//       margin-top: 20px;
//     }
//   }
// `;

// const FormLabel = styled.label`
//   //   width: 110px;
//   line-height: 19px;
//   font-size: 16px;
//   color: #3f3a3a;
//   display: block;
// `;

// const FormCheckInput = styled.input`
//   margin: 0;
//   flex-grow: 1;
//   height: 19px;
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

const RoomCards = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const RoomCard = styled.div`
  display: inline;
  padding: 10px;
`;
const rentRoomDetailsFormGroups = [
  { label: '月租', key: 'rent' },
  { label: '大小', key: 'sq' },
  { label: '規格', key: 'form' },
  { label: '人數', key: 'peopleAmount' },
];
function RentRoomDetails() {
  const dispatch = useDispatch();
  // interface roomDetailsType {
  //   rent: string;
  //   sq: string;
  //   form: string;
  //   peopleAmount: string;
  // }
  const [roomState, setRoomState] = useState<roomDetailsType>([]);
  const rentRef = useRef<HTMLInputElement>(null);
  const sqRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLInputElement>(null);
  const peopleAmountRef = useRef<HTMLInputElement>(null);

  const roomRef = useRef<HTMLInputElement[]>([]);
  function addRooms() {
    let room = {
      rent: Number(roomRef.current[0].value) as number,
      // Number(rentRef.current?.value) as number,
      sq: roomRef.current[1].value as string,
      // sqRef.current?.value as string,
      form: roomRef.current[2].value as string,

      // formRef.current?.value as string,
      peopleAmount: Number(roomRef.current[3].value) as number,

      // Number(peopleAmountRef.current?.value) as number,
    };
    setRoomState([...roomState, room]);
    roomRef.current[0].value = '';
    roomRef.current[1].value = '';
    roomRef.current[2].value = '';
    roomRef.current[3].value = '';
  }
  function submit(roomState: roomDetailsType) {
    dispatch({ type: 'UPLOAD_ROOMS', payload: { roomState } });
    console.log('送出房間');
  }
  return (
    <Wrapper>
      <SubTitle>房間規格</SubTitle>
      {rentRoomDetailsFormGroups.map((r, index) => (
        <FormGroup key={r.key}>
          <FormLabel>{r.label}</FormLabel>
          <FormInputWrapper>
            <FormControl ref={(el) => ((roomRef.current[index] as any) = el)} type="input" />
          </FormInputWrapper>
        </FormGroup>
      ))}
      <RoomCards>
        {roomState.map((el, index) => (
          <RoomCard key={`room${index}`}>
            <div>{el.rent}</div>
            <div>{el.sq}</div>
            <div>{el.form}</div>
            <div>{el.peopleAmount}</div>
          </RoomCard>
        ))}
      </RoomCards>
      <SubmitBtn onClick={() => addRooms()}>+加入房間+</SubmitBtn>
      <SubmitBtn onClick={() => submit(roomState)}>儲存</SubmitBtn>
    </Wrapper>
  );
}

export default RentRoomDetails;
