import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { firebase, newListingRef, timestamp } from '../../../utils/firebase';
import styled from 'styled-components';
import UploadMainImageAndImages from './UploadMainImageAndImages';
import SetBookingTimes from './SetBookingTimes';
import ListingAddr from './ListingAddr';
import ListingTitle from './ListingTitle';
import RoommatesCondition from './RoommatesCondition';
import Facility from './Facility';
import RentRoomDetails from './RentRoomDetails';
import roomDetailsType from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
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
  const getFacility = useSelector((state: RootState) => state.UploadFacilityReducer);
  const getTitle = useSelector((state: RootState) => state.UploadTitleReducer);
  const getImages = useSelector((state: RootState) => state.UploadImagesReducer) as any;
  const getRooms = useSelector((state: RootState) => state.UploadRoomsReducer);
  const getBookingTimes = useSelector((state: RootState) => state.UploadTimesReducer);
  function setDoc() {
    console.log(getAddr);
    console.log(getRoommatesCondition);
    console.log(getFacility);
    console.log(getTitle);
    console.log(getImages);
    console.log(typeof getRooms);
    console.log(getRooms);
    console.log(getBookingTimes);
    const findPeopleAmount = (getRooms as roomDetailsType).reduce((sum, people) => sum + people.peopleAmount, 0);
    const findStartRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent < current.rent ? prev : current
    );
    const findEndRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent > current.rent ? prev : current
    );
    const listingData = {
      ...getTitle,
      // id: 'string',
      // title: getTitle.title,
      uploadedTime: timestamp,
      countyName: getAddr.countyname,
      townName: getAddr.townname,
      peopleAmount: findPeopleAmount,
      startRent: findStartRent.rent,
      endRent: findEndRent.rent,
      moveInDate: new Date(2022, 12, 1), //補上
      // form: getTitle.form,
      // mainImage: getImages[0],

      // images: getImages[1],
      floor: getAddr.floor,
      // sq: getTitle.totalSq,
      // addr: 'string', //補上
      environmentDescription: '預設描述', //補上
      rentRoomDetails: getRooms,
      facility: getFacility,
      roommatesConditions: getRoommatesCondition,
      latLng: { lat: 25.026221, lng: 121.560623 }, //預設北醫
    };
    firebase.setNewListingDocField(newListingRef, listingData, getBookingTimes, getImages.mainImage, getImages.images);
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
