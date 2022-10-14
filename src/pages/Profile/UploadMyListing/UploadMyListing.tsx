import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { doc, collection, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

import { firebase, timestamp, db } from '../../../utils/firebase';
import { Title } from '../../../components/ProfileTitle';
import { BtnDiv } from '../../../components/Button';
import NoListing from '../../../components/NoData';
import Hr from '../../../components/Hr';
import UploadMainImageAndImages from './UploadMainImageAndImages';
import SetBookingTimes from './SetBookingTimes';
import ListingAddr from './ListingAddr';
import ListingTitle from './ListingTitle';
import RoommatesCondition from './RoommatesCondition';
import Facility from './Facility';
import RentRoomDetails from './RentRoomDetails';
import ListingItem from '../../../components/ListingItem';

import { roomDetailsType } from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import addrType from '../../../redux/UploadAddr/UploadAddrType';
import titleType from '../../../redux/UploadTitle/UploadTitleType';
import mainImageAndImagesType from '../../../redux/UploadMainImageAndImages/UploadMainImageAndImagesType';
import { uploadFacilityAction } from '../../../redux/UploadFacility/UploadFacilityAction';
import { uploadImagesAction } from '../../../redux/UploadMainImageAndImages/UploadMainImageAndImagesAction';
import { uploadRoommatesConditionAction } from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionReducerAction';
import { uploadRoomDetailsAction } from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsAction';
import { uploadTitleAction } from '../../../redux/UploadTitle/UploadTitleAction';
import { uploadUserAsRoommateAction } from '../../../redux/UserAsRoommate/UserAsRoommateAction';

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
  flex-wrap: wrap;
  gap: 8px;
`;
const Tab = styled(BtnDiv)<{ isClick: boolean }>`
  border: none;
  border-bottom: ${(props) => (props.isClick ? 'solid 3px #c77155 ' : 'solid 3px lightgrey')};
  box-shadow: none;
  transition-duration: 0.2s;
  white-space: nowrap;
`;
const Span = styled.span`
  align-self: flex-end;
`;
const TabSelect = ['基本資訊', '地址', '上傳圖片', '房間規格', '設定看房時間', '設定室友條件', '設施'];
function UploadMyListing({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer) as addrType;
  const [clickTab, setClickTab] = useState<string>('輸入基本資訊');
  const getRoommatesCondition = useSelector((state: RootState) => state.UploadRoommatesConditionReducer);
  const getTitle = useSelector((state: RootState) => state.UploadTitleReducer) as titleType;
  const getImages = useSelector((state: RootState) => state.UploadImagesReducer) as mainImageAndImagesType;
  const getRooms = useSelector((state: RootState) => state.UploadRoomsReducer);
  const getBookingTimes = useSelector((state: RootState) => state.UploadTimesReducer);
  const getFacility = useSelector((state: RootState) => state.UploadFacilityReducer);

  const [listingData, setListingData] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const listingCollection = collection(db, 'listings');
  async function setDoc() {
    const findPeopleAmount = (getRooms as roomDetailsType).reduce(
      (sum, people) => Number(sum) + Number(people.peopleAmount),
      0
    );
    const findStartRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent > current.rent ? prev : current
    );

    const findEndRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent < current.rent ? prev : current
    );
    const listingData = {
      ...getTitle,
      uploadedTime: timestamp,
      countyName: getAddr.countyname,
      townName: getAddr.townname,
      peopleAmount: findPeopleAmount,
      startRent: Number(findStartRent.rent),
      endRent: Number(findEndRent.rent),
      floor: getAddr.floor,
      rentRoomDetails: getRooms,
      facility: getFacility,
      roommatesConditions: getRoommatesCondition,
      addr: `${getAddr.countyname}${getAddr.townname}${getAddr.completeAddr}${getAddr.floor}樓`,
      latLng: getAddr.latLng,
      matchGroup: [],
    };

    const newListingRef = doc(listingCollection);
    await firebase.setNewListingDocField(
      newListingRef,
      listingData,
      getBookingTimes,
      getImages.mainImage,
      getImages.images,
      userInfo!.uid
    );
    let listingDocData: QueryDocumentSnapshot<DocumentData> | null;
    listingDocData = await firebase.getListingDoc(newListingRef.id);
    setListingData(listingDocData);
  }
  useEffect(() => {
    async function getListing() {
      let listingDocData;

      listingDocData = await firebase.getListingDoc(userInfo!.userListingId);

      setListingData(listingDocData);
    }
    getListing();
  }, [userInfo!.userListingId?.length !== 0]);
  return (
    <Wrapper>
      <Title
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        管理物件
        {userInfo!.userListingId?.length !== 0 ? (
          <span style={{ fontSize: '20px', alignSelf: 'flex-end' }}>你的物件</span>
        ) : !edit ? (
          <React.Fragment>
            <SubmitBtn
              onClick={() => {
                setEdit(true);
                setClickTab('基本資訊');
              }}
            >
              我要上架
            </SubmitBtn>
          </React.Fragment>
        ) : (
          <Span>
            <SubmitBtn
              onClick={() => {
                setEdit(false);
                dispatch({ type: uploadFacilityAction.RETURN_INITIAL_FACILITY });
                dispatch({ type: uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES });
                dispatch({ type: uploadRoommatesConditionAction.RETURN_INITIAL_ROOMMATES_CONDITION });
                dispatch({ type: uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS });
                dispatch({
                  type: uploadTitleAction.RETURN_INITIAL_TITLE,
                });
                dispatch({ type: uploadUserAsRoommateAction.RETURN_INITIAL_ME_AS_ROOMMATE });
              }}
            >
              取消
            </SubmitBtn>
          </Span>
        )}
      </Title>
      <Hr />
      {userInfo!.userListingId?.length !== 0 && <ListingItem listingDocData={listingData} />}
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
      {userInfo!.userListingId?.length === 0 && !edit && <NoListing msg="你沒有上架房源" />}
      {clickTab === '基本資訊' && edit && <ListingTitle setClickTab={setClickTab} />}
      {clickTab === '地址' && edit && <ListingAddr setClickTab={setClickTab} />}
      {clickTab === '上傳圖片' && edit && <UploadMainImageAndImages setClickTab={setClickTab} />}
      {clickTab === '房間規格' && edit && <RentRoomDetails setClickTab={setClickTab} />}
      {clickTab === '設定看房時間' && edit && <SetBookingTimes setClickTab={setClickTab} />}
      {clickTab === '設定室友條件' && edit && <RoommatesCondition setClickTab={setClickTab} />}
      {clickTab === '設施' && edit && <Facility setClickTab={setClickTab} setDoc={setDoc} />}
    </Wrapper>
  );
}

export default UploadMyListing;
