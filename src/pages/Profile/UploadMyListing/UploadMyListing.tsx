import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import '../../utils/Calendar.css';
import styled from 'styled-components';
import UploadMainImageAndImages from './UploadMainImageAndImages';
import SetBookingTimes from './SetBookingTimes';
import ListingAddr from './ListingAddr';
import ListingTitle from './ListingTitle';
import RoommatesCondition from './RoommatesCondition';
import Facility from './Facility';
import RentRoomDetails from './RentRoomDetails';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
`;

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  padding: 10px;
`;

function UploadMyListing() {
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer);
  const getRoommatesCondition = useSelector((state: RootState) => state.UploadRoommatesConditionReducer);
  const getFacility = useSelector((state: RootState) => state.UploadRoommatesConditionReducer);

  function setDoc() {
    console.log(getAddr);
    console.log(getRoommatesCondition);
    console.log(getFacility);
  }
  return (
    <Wrapper>
      <h1>上傳物件</h1>
      <ListingTitle />
      <ListingAddr />
      <UploadMainImageAndImages />
      <RentRoomDetails />
      <SetBookingTimes />
      <RoommatesCondition />
      <Facility />
      <SubmitBtn onClick={() => setDoc()}>上傳</SubmitBtn>
    </Wrapper>
  );
}

export default UploadMyListing;
