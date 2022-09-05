import React, { useState, useRef } from 'react';
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
const rentRoomDetailsFormGroups = [
  { label: '月租', key: 'rent' },
  { label: '大小', key: 'sq' },
  { label: '規格', key: 'from' },
  { label: '人數', key: 'from' },
];
function UploadMyListing() {
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
    </Wrapper>
  );
}

export default UploadMyListing;
