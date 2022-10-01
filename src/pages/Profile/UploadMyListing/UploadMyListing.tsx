import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import { firebase, timestamp, db } from "../../../utils/firebase";
import {
  query,
  getFirestore,
  getDocs,
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  serverTimestamp,
  addDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
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
import titleType from "../../../redux/UploadTitle/UploadTitleType";
import { Title } from "../../../components/ProfileTitle";
import { BtnDiv, BtnLink } from "../../../components/Button";
import { Loading } from "../../../components/Loading";
import NoListing from "../../../components/NoData";
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
  border: solid 1px #4f5152;
  align-self: flex-end;
  margin-top: 20px;
  display: inline-block;
  margin-left: 12px;
  transform: translateY(-4px);
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const Tab = styled(BtnDiv)<{ isClick: boolean }>`
  border: none;
  border-bottom: ${(props) => (props.isClick ? "solid 3px #c77155 " : "none")};
`;
const Span = styled.span`
  align-self: flex-end;
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
  const getTitle = useSelector(
    (state: RootState) => state.UploadTitleReducer
  ) as titleType;
  const getImages = useSelector(
    (state: RootState) => state.UploadImagesReducer
  ) as any;
  const getRooms = useSelector((state: RootState) => state.UploadRoomsReducer);
  const getBookingTimes = useSelector(
    (state: RootState) => state.UploadTimesReducer
  );
  const [edit, setEdit] = useState<boolean>(false);
  function setDoc(facilityOptions: any) {
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
      uploadedTime: timestamp,
      countyName: getAddr.countyname,
      townName: getAddr.townname,
      peopleAmount: findPeopleAmount,
      startRent: findStartRent.rent,
      endRent: findEndRent.rent,
      floor: getAddr.floor,
      rentRoomDetails: getRooms,
      facility: facilityOptions,
      roommatesConditions: getRoommatesCondition,
      addr: `${getAddr.countyname}${getAddr.townname}${getAddr.completeAddr}${getAddr.floor}樓`, //補上
      latLng: getAddr.latLng, //預設北醫
      matchGroup: [],
    };
    const listingCollection = collection(db, "listings");
    const userCollection = collection(db, "users");
    const newListingRef = doc(listingCollection);
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
      <Title
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        管理物件
        <Span>
          {userInfo!.userListingId?.length === 0 && !edit ? (
            <React.Fragment>
              <SubmitBtn
                onClick={() => {
                  setEdit(true);
                  setClickTab("基本資訊");
                }}
              >
                我要上架
              </SubmitBtn>
            </React.Fragment>
          ) : (
            <SubmitBtn onClick={() => setEdit(false)}>取消</SubmitBtn>
          )}
        </Span>
      </Title>
      <Hr />
      {/* {loading ?  <Loading/> && } */}
      {edit && (
        <Tabs>
          {TabSelect.map((el, index) => (
            <Tab
              key={`subTab${index}`}
              isClick={el === clickTab}
              onClick={() => {
                setClickTab(el);
              }}
            >
              {el}
            </Tab>
          ))}
        </Tabs>
      )}
      {userInfo!.userListingId?.length === 0 && !edit && (
        <NoListing msg="你沒有上架房源" />
      )}
      {clickTab === "基本資訊" && edit && (
        <ListingTitle setClickTab={setClickTab} />
      )}
      {clickTab === "地址" && edit && <ListingAddr setClickTab={setClickTab} />}
      {clickTab === "上傳圖片" && edit && (
        <UploadMainImageAndImages setClickTab={setClickTab} />
      )}
      {clickTab === "房間規格" && edit && (
        <RentRoomDetails setClickTab={setClickTab} />
      )}
      {clickTab === "設定看房時間" && edit && (
        <SetBookingTimes setClickTab={setClickTab} />
      )}
      {clickTab === "設定室友條件" && edit && (
        <RoommatesCondition setClickTab={setClickTab} />
      )}
      {clickTab === "設施" && edit && (
        <Facility setClickTab={setClickTab} setDoc={setDoc} />
      )}
      {/* <SubmitBtn onClick={() => setDoc()}>上傳</SubmitBtn> */}
    </Wrapper>
  );
}

export default UploadMyListing;
