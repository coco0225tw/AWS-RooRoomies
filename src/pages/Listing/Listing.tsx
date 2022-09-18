import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Map from './Map';
import CalendarContainer from '../../components/Calendar';
import { firebase } from '../../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import RoommatesCondition from './RoommatesCondition';
import Facility from './Facility';
import RoomDetails from './RoomDetails';
import Group from './Group';
import { Link, useNavigate } from 'react-router-dom';
import { groupType, userInfoType } from '../../redux/Group/GroupType';
// import { groupType, userInfoType } from '../../redux/Group/GroupType';
import roomDetailsType from '../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import bookingTimesType from '../../redux/UploadBookingTimes/UploadBookingTimesType';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';

import likedIcon from '../../assets/heart.png';
import unLikedIcon from '../../assets/unHeart.png';

import addIcon from '../../assets/add.png';
import unAddIcon from '../../assets/unAdd.png';

import { BtnDiv } from '../../components/Button';
import Popup from '../../components/Popup';
import Hr from '../../components/Hr';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
`;

const SectionWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const ImagesWrapper = styled(SectionWrapper)`
  height: 50vh;
`;
const OtherImagesWrapper = styled(SectionWrapper)`
  flex-wrap: wrap;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
`;
const TitleWrapper = styled(SectionWrapper)`
  flex-direction: column;
  // height: 100vh;
`;

const DividedCalendarSection = styled(SectionWrapper)`
  flex-direction: row;
  // align-items: flex-start;
  // background-color: grey;
`;

const SelectTimeWrapper = styled(SectionWrapper)`
  width: 48%;
  border-bottom: solid 1px #c77155;
  padding: 10px;
  color: #4f5152;
  // border-radius: 4px;
  // cursor: pointer;
  transition: 0.2s;
  justify-content: space-between;
  align-items: baseline;
  // &:hover {
  //   color: white;
  //   background-color: #c77155;
  // }
`;
const MainImage = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 50%;
  object-fit: cover;
`;
const Images = styled(MainImage)``;

const InformationWrapper = styled(SectionWrapper)`
  flex-direction: row;
  align-items: start;
`;
const Title = styled.div`
  font-size: 40px;
  //width: 100%;
`;
const AddrSection = styled(SectionWrapper)``;
const StickyCalendarContainer = styled.div`
  display: flex;
  // flex-grow: 1;
  flex-direction: column;
  align-items: start;
  position: sticky;
  top: 80px;
  align-self: flex-start;
  // width: 100%;
  // background-color: brown;
  // background-color: black;
`;

const Times = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const SelectedDate = styled.div`
  font-size: 20px;
  color: #4f5152;
  width: 100%;
`;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;
const FavoriteIcon = styled.div<{ isLiked: boolean }>`
  background-image: url(${(props) => (props.isLiked ? likedIcon : unLikedIcon)});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;

const CompareIcon = styled.div<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;
const IsBookedTimes = styled.div``;
const SubTitle = styled.div`
  font-size: 28px;
  letter-spacing: 12px
  font-weight: bold;
  color: #4f5152;
  width: 100%;
`;

// const Hr = styled.div`
//   background-color: #4f5152;
//   width: 100%;
//   height: 1px;
//   margin: 4px 0px 12px;
// `;

const SelectTime = styled.div`
  font-size: 16px;
  letter-spacing: 4px;
`;

const CanBookedBtn = styled(BtnDiv)``;
const CannotBookedBtn = styled(BtnDiv)`
  cursor: initial;
  background-color: #f3f2ef;
  &:hover {
    background-color: #f3f2ef;
  }
`;
const UserBookBtn = styled(BtnDiv)``;
function Listing() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const { id } = useParams<string>();
  const dispatch = useDispatch();
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);
  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isLiked: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (!isLiked) {
      async function addToFavoriteLists() {
        await firebase.addToFavoriteLists(userInfo.uid, id!);
      }
      addToFavoriteLists();
      dispatch({ type: 'ADD_TO_FAVORITELISTS', payload: { id: id! } });
    } else {
      async function removeFromFavoriteLists() {
        await firebase.removeFromFavoriteLists(userInfo.uid, id!);
      }
      removeFromFavoriteLists();
      dispatch({ type: 'REMOVE_FROM_FAVORITELISTS', payload: { id: id! } });
    }
  }
  function handleCompare(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (!isCompared) {
      async function addToCompareLists() {
        await firebase.addToCompareLists(userInfo.uid, id!);
      }
      addToCompareLists();
      dispatch({ type: 'ADD_TO_COMPARELISTS', payload: { id: id! } });
    } else {
      async function removeFromCompareLists() {
        await firebase.removeFromCompareLists(userInfo.uid, id!);
      }
      removeFromCompareLists();
      handleDnd(e, isCompared);
      dispatch({ type: 'REMOVE_FROM_COMPARELIST', payload: { id: id! } });
    }
  }
  function handleDnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (isCompared) {
      async function removeFromDndLists() {
        await firebase.removeFromDndLists(userInfo.uid, id!);
      }
      removeFromDndLists();
      dispatch({ type: 'REMOVE_FROM_DNDLISTS', payload: { id: id! } });
    }
  }
  type ListingType = {
    mainImage: string;
    images: string[];
    title: string;
    countyName: string;
    townName: string;
    form: string;
    environmentDescription: string;
    roommatesConditions: roommatesConditionType;
    facility: facilityType;
    rentRoomDetails: roomDetailsType;
    peopleAmount: number;
    matchGroup: Array<groupType>;
    listingTitle: string;
  };

  const [listingInfo, setListingInfo] = useState<ListingType>();
  const [bookingTimesInfo, setBookingTimesInfo] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [ableBookingTimes, setAbleBookingTimes] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [alreadyBookedPopup, setAlreadyBookedPopup] = useState<boolean>(false);
  const [checkIfUserCanBook, setCheckIfUserCanBook] = useState<boolean>(false);
  type tileDisabledType = { date: Date };
  const tileDisabled = ({ date }: tileDisabledType) => {
    if (ableBookingTimes.length !== 0) {
      return !ableBookingTimes.some(
        (disabledDate: any) =>
          date.getFullYear() === disabledDate.getFullYear() &&
          date.getMonth() === disabledDate.getMonth() &&
          date.getDate() === disabledDate.getDate()
      );
    } else {
      return false;
    }
  };
  function clickDate(date: Date) {
    setSelectedDate(date);
  }
  async function bookedTime(uid: string, docId: string, listingId: string, selectedDateTime: any) {
    let chatRoomId!: string;
    let userId!: [];
    if (checkIfUserCanBook) {
      const bookedRecord = {
        chatRoomId,
        ...selectedDateTime,
        userId,
      };
      async function updateAllBookedTime() {
        await Promise.all([
          firebase.bookedTime(listingId, docId),
          firebase.bookedTimeInChatRoom(chatRoomId as string, selectedDateTime),
          firebase.createBookedTimeInfo(listingId, bookedRecord),
        ]);
      }
      updateAllBookedTime();
    } else {
      setAlreadyBookedPopup(true);
    }
  }
  async function check(uid: string, listingId: string) {
    await firebase.checkIfUserCanBook(uid, listingId).then((listing) => {
      let chatRoomId!: string;
      let userId!: [];
      let isBooked: boolean;
      listing.forEach((doc) => {
        isBooked = doc.data().isBooked;
        chatRoomId = doc.id;
        userId = doc.data().userId;
      });
      console.log(isBooked!);
      console.log(!isBooked!);
      setCheckIfUserCanBook(!isBooked!);
    });
  }
  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType;
      setListingInfo(data);
    }
    async function getBookingTimes() {
      await firebase.getBookingTimesSubColForListing(id!).then((times) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        times.forEach((doc) => {
          listingTimesArr.push(doc);
        });
        setBookingTimesInfo(listingTimesArr);

        let enableDate = [];
        if (listingTimesArr?.length !== 0) {
          enableDate = listingTimesArr?.reduce((acc: any, curr: any) => {
            let findIndex = acc.findIndex((item: any) => item?.data().date.seconds === curr.data().date.seconds); //console.log
            if (findIndex === -1) {
              acc.push(curr);
            } else {
            }
            return acc;
          }, []);
          setAbleBookingTimes(enableDate);
        }
        let enableDates = enableDate.map((s: QueryDocumentSnapshot<DocumentData>) => {
          let date = s.data().date.toDate();
          return date;
        });
        setAbleBookingTimes(enableDates);
      });
    }
    async function promise() {
      await Promise.all([getBookingTimes(), getListing()]);
      await check(userInfo.uid, id!);
    }

    promise();
  }, [id]);
  return (
    <Wrapper>
      {alreadyBookedPopup && (
        <Popup
          msg={`一團只能預約一個時間哦!!`}
          notDefaultBtn={`確認`}
          defaultBtn={`回物件管理頁面取消`}
          clickClose={() => setAlreadyBookedPopup(false)}
          clickFunction={() => navigate('/profile')}
        />
      )}
      <div>房源id:{id}</div>
      <ImagesWrapper>
        <MainImage src={listingInfo?.mainImage} />
        <OtherImagesWrapper>
          {listingInfo?.images && listingInfo.images.map((src, index) => <Images key={`images_${index}`} src={src} />)}
        </OtherImagesWrapper>
      </ImagesWrapper>
      <DividedCalendarSection>
        {/* <InformationWrapper> */}
        <TitleWrapper>
          <Title>{listingInfo?.title}</Title>
          <FavoriteIcon
            onClick={(e) => handleLiked(e!, favoriteLists.includes(id!))}
            isLiked={favoriteLists.includes(id!)}
          ></FavoriteIcon>
          <CompareIcon
            onClick={(e) => {
              handleCompare(e!, compareLists.includes(id!) || dndLists.includes(id!));
            }}
            isCompared={compareLists.includes(id!) || dndLists.includes(id!)}
          ></CompareIcon>
          <AddrSection>
            {listingInfo?.countyName}
            {listingInfo?.townName}
            <br />
            {listingInfo?.form}
            <br />
            {listingInfo?.environmentDescription}
          </AddrSection>
          <RoommatesCondition roommatesConditions={listingInfo?.roommatesConditions}></RoommatesCondition>
          <Group
            peopleAmount={listingInfo?.peopleAmount!}
            listingId={id!}
            listingTitle={listingInfo?.listingTitle!}
          ></Group>
          <Facility facility={listingInfo?.facility}></Facility>
          <RoomDetails room={listingInfo?.rentRoomDetails}></RoomDetails>
        </TitleWrapper>
        <StickyCalendarContainer>
          <SubTitle>預約看房</SubTitle>
          {/* <SubTitle>剩下{bookingTimesInfo.filter((el) => el.data().isBooked === false).length}個時間可以預約</SubTitle> */}
          <Hr />
          <CalendarContainer>
            <Calendar tileDisabled={tileDisabled} onClickDay={clickDate} />
          </CalendarContainer>
          <Times>
            {selectedDate && (
              <SelectedDate>
                {selectedDate.getFullYear() +
                  '-' +
                  ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
                  '-' +
                  ('0' + selectedDate.getDate()).slice(-2)}
              </SelectedDate>
            )}
            {selectedDate &&
              bookingTimesInfo
                .filter(
                  (el) => el.data().date.toDate().getTime() !== selectedDate.getTime() && el.data().isBooked === false
                )
                .map((el, index) => (
                  <SelectTimeWrapper key={`selectedTimes_${index}`}>
                    <SelectTime>{el.data().startTime}</SelectTime>
                    <CanBookedBtn
                      onClick={() =>
                        bookedTime(userInfo.uid, el.id, id!, { date: el.data().date, startTime: el.data().startTime })
                      }
                    >
                      預約
                    </CanBookedBtn>
                  </SelectTimeWrapper>
                ))}
            {selectedDate &&
              bookingTimesInfo
                .filter(
                  (el) => el.data().date.toDate().getTime() !== selectedDate.getTime() && el.data().isBooked === true
                )
                .map((el, index) => (
                  <SelectTimeWrapper key={`selectedTimes_${index}`}>
                    <SelectTime>{el.data().startTime}</SelectTime>
                    <CannotBookedBtn>已預約</CannotBookedBtn>
                  </SelectTimeWrapper>
                ))}
          </Times>
        </StickyCalendarContainer>
        {/* </InformationWrapper> */}
      </DividedCalendarSection>
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
