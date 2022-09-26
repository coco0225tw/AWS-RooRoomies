import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import { firebase, newListingRef, timestamp } from "../../../utils/firebase";
import styled from "styled-components";
import UploadMainImageAndImages from "./UploadMainImageAndImages";
import SetBookingTimes from "./SetBookingTimes";
import ListingAddr from "./ListingAddr";
import ListingTitle from "./ListingTitle";
import RoommatesCondition from "./RoommatesCondition";
import Facility from "./Facility";
import RentRoomDetails from "./RentRoomDetails";
import roomDetailsType from "../../../redux/UploadRoomsDetails/UploadRoomsDetailsType";
import addrType from "../../../redux/UploadAddr/UploadAddrType";
import { Title } from "../../../components/ProfileTitle";
import { BtnDiv, BtnLink } from "../../../components/Button";
import { Loading } from "../../../components/Loading";

import Hr from "../../../components/Hr";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;

const SubmitBtn = styled(BtnDiv)`
  background-color: grey;
  color: white;
  cursor: pointer;
  padding: 10px;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const Tab = styled(BtnDiv)<{ isClick: boolean }>`
  border-bottom: ${(props) => (props.isClick ? "solid 3px #c77155 " : "none")};
`;

const TabSelect = [
  "基本資訊",
  "地址",
  "上傳圖片",
  "房間規格",
  "設定看房時間",
  "設定室友條件",
  "設施",
];
function UploadMyListing({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const getAddr = useSelector(
    (state: RootState) => state.UploadAddrReducer
  ) as addrType;
  const [clickTab, setClickTab] = useState<string>("輸入基本資訊");
  const getRoommatesCondition = useSelector(
    (state: RootState) => state.UploadRoommatesConditionReducer
  );
  const getFacility = useSelector(
    (state: RootState) => state.UploadFacilityReducer
  );
  const getTitle = useSelector((state: RootState) => state.UploadTitleReducer);
  const getImages = useSelector(
    (state: RootState) => state.UploadImagesReducer
  ) as any;
  const getRooms = useSelector((state: RootState) => state.UploadRoomsReducer);
  const getBookingTimes = useSelector(
    (state: RootState) => state.UploadTimesReducer
  );
  function setDoc() {
    console.log(getAddr);
    console.log(getRoommatesCondition);
    console.log(getFacility);
    console.log(getTitle);
    console.log(getImages);
    console.log(typeof getRooms);
    console.log(getRooms);
    console.log(getBookingTimes);
    const findPeopleAmount = (getRooms as roomDetailsType).reduce(
      (sum, people) => sum + people.peopleAmount,
      0
    );
    const findStartRent = (getRooms as roomDetailsType).reduce(
      (prev, current) => (prev.rent < current.rent ? prev : current)
    );
    const findEndRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent > current.rent ? prev : current
    );
    const listingData = {
      ...getTitle,
      // id: 'string',
      uploadedTime: timestamp,
      countyName: getAddr.countyname,
      townName: getAddr.townname,
      peopleAmount: findPeopleAmount,
      startRent: findStartRent.rent,
      endRent: findEndRent.rent,
      // mainImage: getImages[0],
      // images: getImages[1],
      floor: getAddr.floor,
      rentRoomDetails: getRooms,
      facility: getFacility,
      roommatesConditions: getRoommatesCondition,
      moveInDate: new Date(2022, 12, 1), //補上
      addr: `${getAddr.countyname}${getAddr.townname}${getAddr.floor}樓`, //補上
      latLng: getAddr.latLng, //預設北醫
      matchGroup: [],
    };
    firebase.setNewListingDocField(
      newListingRef,
      listingData,
      getBookingTimes,
      getImages.mainImage,
      getImages.images,
      userInfo!.uid
    );
  }
  return (
    <Wrapper>
      <Title>管理物件</Title>
      <Hr />
      {/* {loading ?  <Loading/> && } */}
      {userInfo!.userListingId?.length !== 0 && <div>你有一個上傳物件</div>}
      <Tabs>
        {TabSelect.map((el, index) => (
          <Tab
            isClick={el === clickTab}
            onClick={() => {
              setClickTab(el);
            }}
          >
            {el}
          </Tab>
        ))}
      </Tabs>
      {clickTab === "基本資訊" && <ListingTitle setClickTab={setClickTab} />}
      {clickTab === "地址" && <ListingAddr setClickTab={setClickTab} />}
      {clickTab === "上傳圖片" && (
        <UploadMainImageAndImages setClickTab={setClickTab} />
      )}
      {clickTab === "房間規格" && <RentRoomDetails setClickTab={setClickTab} />}
      {clickTab === "設定看房時間" && (
        <SetBookingTimes setClickTab={setClickTab} />
      )}
      {clickTab === "設定室友條件" && (
        <RoommatesCondition setClickTab={setClickTab} />
      )}
      {clickTab === "設施" && (
        <Facility setClickTab={setClickTab} setDoc={setDoc} />
      )}
      {/* <SubmitBtn onClick={() => setDoc()}>上傳</SubmitBtn> */}
    </Wrapper>
  );
}

export default UploadMyListing;
