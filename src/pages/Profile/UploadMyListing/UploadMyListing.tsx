import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { doc, collection, QueryDocumentSnapshot, DocumentData, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { firebase, timestamp, db } from '../../../utils/firebase';
import { Title, SubTitle } from '../../../components/ProfileTitle';
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
import { Loading } from '../../../components/Loading';

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
import { getAuthAction } from '../../../redux/GetAuth/GetAuthAction';
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
  &:hover {
    background-color: #fff;
  }
`;
const Span = styled.span`
  align-self: flex-end;
`;
const StyleLink = styled(Link)`
  width: 100%;
  margin-bottom: 20px;
  border: solid 1px #f3f2ef;
  padding: 12px;
  border-radius: 8px;
`;
const WrapListingDoc = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const BookedTimeWrap = styled.div<{ isOutdated: boolean }>`
  font-size: 20px;
  padding: 12px;
  display: flex;
  margin-top: 12px;
  justify-content: space-between;
  border: solid 1px #f3f2ef;
  border-radius: 8px;
  background-color: ${(props) => !props.isOutdated && '#f3f2ef'};
`;
const DateArea = styled.div``;
const StartTime = styled.div``;
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

  const [bookingTimesInfo, setBookingTimesInfo] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const [listingData, setListingData] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [nowDate, setNowDate] = useState<null | Date>(null);
  const listingCollection = collection(db, 'listings');
  async function setDoc() {
    const findPeopleAmount = (getRooms as roomDetailsType).reduce(
      (sum, people) => Number(sum) + Number(people.peopleAmount),
      0
    );
    const findStartRent = (getRooms as roomDetailsType).reduce((prev, current) =>
      prev.rent < current.rent ? prev : current
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
      startRent: Number(findStartRent.rent),
      endRent: Number(findEndRent.rent),
      floor: getAddr.floor,
      totalFloor: getAddr.totalFloor,
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
    dispatch({
      type: getAuthAction.UPLOAD_LISTING,
      payload: { userListingId: newListingRef.id },
    });
  }

  useEffect(() => {
    if (userInfo!.userListingId?.length !== 0 && !listingData) {
      getBookingTimes();
    }
    function getBookingTimes() {
      async function getListing() {
        let listingDocData: QueryDocumentSnapshot<DocumentData>;

        listingDocData = await firebase.getListingDoc(userInfo!.userListingId);

        setListingData(listingDocData);
      }
      if (userInfo!.userListingId?.length !== 0 && !listingData) {
        getListing();
      }
      const subColRef = collection(db, 'listings', userInfo!.userListingId, 'bookingTimes');
      const getAllMessages = onSnapshot(subColRef, (snapshot) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        snapshot.forEach((doc) => {
          if (doc.data().isBooked) {
            listingTimesArr.push(doc);
          }
        });
        listingTimesArr.sort((a, b) => a.data().date - b.data().date);
        setBookingTimesInfo(listingTimesArr);
      });
    }
  }, [userInfo!.userListingId]);
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
        {listingData ? (
          <span style={{ fontSize: '20px', alignSelf: 'flex-end' }}>你的物件</span>
        ) : !edit && !isUploading ? (
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
          !isUploading &&
          edit && (
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
          )
        )}
      </Title>
      <Hr />
      {isUploading && <Loading style={null} />}
      {listingData && !isUploading && (
        <WrapListingDoc>
          <StyleLink to={`/listing/${listingData.id}`}>
            <ListingItem listingDocData={listingData} />
          </StyleLink>
          <SubTitle>已被預約的時間</SubTitle>
          {bookingTimesInfo.length === 0 ? (
            <BookedTimeWrap isOutdated={false}>無</BookedTimeWrap>
          ) : (
            <React.Fragment>
              {bookingTimesInfo
                .filter((data, index) => data.data().date.toDate() > new Date())
                .map((data, index) => (
                  <BookedTimeWrap isOutdated={false}>
                    <DateArea>
                      {data.data().date.toDate().getFullYear() +
                        '-' +
                        ('0' + (data.data().date.toDate().getMonth() + 1)).slice(-2) +
                        '-' +
                        ('0' + data.data().date.toDate().getDate()).slice(-2)}
                    </DateArea>
                    <StartTime>{data.data().startTime}</StartTime>
                  </BookedTimeWrap>
                ))}
              {bookingTimesInfo
                .filter((data, index) => data.data().date.toDate() < new Date())
                .map((data, index) => (
                  <BookedTimeWrap isOutdated={true}>
                    <DateArea>
                      {data.data().date.toDate().getFullYear() +
                        '-' +
                        ('0' + (data.data().date.toDate().getMonth() + 1)).slice(-2) +
                        '-' +
                        ('0' + data.data().date.toDate().getDate()).slice(-2)}
                    </DateArea>
                    <StartTime>{data.data().startTime}</StartTime>
                  </BookedTimeWrap>
                ))}
            </React.Fragment>
          )}
        </WrapListingDoc>
      )}
      {!isUploading && edit && (
        <Tabs>
          {TabSelect.map((el, index) => (
            <Tab key={`subTab${index}`} isClick={el === clickTab}>
              {el}
            </Tab>
          ))}
        </Tabs>
      )}
      {!listingData && !edit && <NoListing msg={isUploading ? '上傳中' : '你沒有上傳的物件'} />}
      {clickTab === '基本資訊' && edit && <ListingTitle setClickTab={setClickTab} />}
      {clickTab === '地址' && edit && <ListingAddr setClickTab={setClickTab} />}
      {clickTab === '上傳圖片' && edit && <UploadMainImageAndImages setClickTab={setClickTab} />}
      {clickTab === '房間規格' && edit && <RentRoomDetails setClickTab={setClickTab} />}
      {clickTab === '設定看房時間' && edit && <SetBookingTimes setClickTab={setClickTab} />}
      {clickTab === '設定室友條件' && edit && <RoommatesCondition setClickTab={setClickTab} />}
      {!isUploading && clickTab === '設施' && edit && (
        <Facility setClickTab={setClickTab} setDoc={setDoc} setIsUploading={setIsUploading} setEdit={setEdit} />
      )}
    </Wrapper>
  );
}

export default UploadMyListing;
