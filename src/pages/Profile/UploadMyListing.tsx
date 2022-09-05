import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
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

function UploadMyListing() {
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer);
  const getRoommatesCondition = useSelector((state: RootState) => state.UploadRoommatesConditionReducer);
  console.log(getAddr);
  console.log(getRoommatesCondition);
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
      <div>上傳</div>
    </Wrapper>
  );
}

export default UploadMyListing;
