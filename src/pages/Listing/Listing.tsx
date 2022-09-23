import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Map from "./Map";
import CalendarContainer from "../../components/Calendar";
import { firebase } from "../../utils/firebase";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue,
  Timestamp,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import RoommatesCondition from "./RoommatesCondition";
import Facility from "./Facility";
import RoomDetails from "./RoomDetails";
import Group from "./Group";
import { Link, useNavigate } from "react-router-dom";
import { groupType, userInfoType } from "../../redux/Group/GroupType";
// import { groupType, userInfoType } from '../../redux/Group/GroupType';
import roomDetailsType from "../../redux/UploadRoomsDetails/UploadRoomsDetailsType";
import bookingTimesType from "../../redux/UploadBookingTimes/UploadBookingTimesType";
import roommatesConditionType from "../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import facilityType from "../../redux/UploadFacility/UploadFacilityType";

import likedIcon from "../../assets/heart.png";
import unLikedIcon from "../../assets/unHeart.png";

import addIcon from "../../assets/add.png";
import unAddIcon from "../../assets/unAdd.png";

import { BtnDiv } from "../../components/Button";
import { PopupComponent, PopupImage } from "../../components/Popup";
import Hr from "../../components/Hr";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: 80px auto 0;
  color: #4f5152;
  padding: 80px 0px 0px;
`;

const SectionWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const ImagesWrapper = styled(SectionWrapper)`
  height: 50vh;
  overflow: hidden;
  border-radius: 20px;
  justify-content: space-between;
  align-items: flex-start;
`;
const OtherImagesWrapper = styled(SectionWrapper)`
  flex-wrap: wrap;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
  width: 49%;
  justify-content: space-between;
  align-items: flex-start;
`;
const TitleWrapper = styled(SectionWrapper)`
  font-size: 20px;
  flex-direction: column;
  width: 60%;
  // height: 100vh;
`;

const DividedCalendarSection = styled(SectionWrapper)`
  flex-direction: row;
  // align-items: flex-start;
  // background-color: grey;
  margin: 20px 0px 32px;
  justify-content: space-between;
  align-items: center;
`;

const SelectTimeWrapper = styled(SectionWrapper)`
  width: 48%;
  border-bottom: solid 1px #c77155;
  padding: 10px 0px;
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

const ImageWrap = styled.div`
  width: 49%;
  cursor: pointer;
  overflow: hidden;
  height: 100%;
  &:hover {
    filter: brightness(70%);
  }
`;
const MainImage = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.src});

  transition-duration: 0.2s;
  &:hover {
    transform: scale(120%);
  }
`;
const Images = styled(MainImage)`
  height: auto;
  aspect-ratio: 1 / 1;
  // width: 50%;
  // height: auto;
`;

const InformationWrapper = styled(SectionWrapper)`
  flex-direction: row;
  align-items: start;
`;
const Title = styled.div`
  font-size: 40px;
  //width: 100%;
`;
const AddrSection = styled(SectionWrapper)`
  justify-content: space-between;
  margin-top: 32px;
`;
const StickyCalendarContainer = styled.div`
  display: flex;
  // flex-grow: 1;
  flex-direction: column;
  align-items: start;
  position: sticky;
  top: 100px;
  align-self: flex-start;
  width: calc(350px + 40px + 20px);
  // background-color: brown;
  // background-color: black;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
  border-radius: 20px;
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
  margin-top: 32px;
`;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;

const Icon = styled.div`
  aspect-ratio: 1 / 1;
  height: auto;
  width: 40px;
  background-size: 100% 100%;
  cursor: pointer;
  // flex-grow: 1;
  &:hover {
    width: 48px;
  }
`;
const FavoriteIcon = styled(Icon)<{ isLiked: boolean }>`
  background-image: url(${(props) =>
    props.isLiked ? likedIcon : unLikedIcon});
`;

const CompareIcon = styled(Icon)<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
  margin-left: 12px;
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
const IconArea = styled.div`
  display: flex;
  justify-content: flex-end;
  // padding: 8px 8px 0px 0px;
  align-items: end;
  transition-duration: 0.2s;
  align-self: flex-end;
  width: 100%;
  height: 52px;
  padding-bottom: 12px;
`;
const Rent = styled.div`
  // right: 0px;
  color: #c77155;
  font-size: 28px;
`;
const TitleDivide = styled(SectionWrapper)`
  align-self: flex-start;
  width: auto;
  justify-content: space-between;
  flex-direction: column;
  // flex-wrap: wrap;
`;
const TitleInfoWrapper = styled(SectionWrapper)`
  align-items: center;
  width: auto;
`;
const TitleIcon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  border-bottom: solid 3px #c77155;
`;
const TitleIconWrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;
function Listing() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const { id } = useParams<string>();
  const dispatch = useDispatch();
  const compareLists = useSelector(
    (state: RootState) => state.GetCompareListsReducer
  );
  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const favoriteLists = useSelector(
    (state: RootState) => state.GetFavoriteListsReducer
  );
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  function handleLiked(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isLiked: boolean
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange) {
      if (!isLiked) {
        async function addToFavoriteLists() {
          await firebase.addToFavoriteLists(userInfo.uid, id!);
        }
        addToFavoriteLists();
        dispatch({ type: "ADD_TO_FAVORITELISTS", payload: { id: id! } });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, id!);
        }
        removeFromFavoriteLists();
        dispatch({ type: "REMOVE_FROM_FAVORITELISTS", payload: { id: id! } });
      }
    } else {
      setIsShown(true);
      console.log("popup");
    }
  }
  function handleCompare(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isCompared: boolean
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange) {
      if (!isCompared) {
        async function addToCompareLists() {
          await firebase.addToCompareLists(userInfo.uid, id!);
        }
        addToCompareLists();
        dispatch({ type: "ADD_TO_COMPARELISTS", payload: { id: id! } });
      } else {
        async function removeFromCompareLists() {
          await firebase.removeFromCompareLists(userInfo.uid, id!);
        }
        removeFromCompareLists();
        handleDnd(e, isCompared);
        dispatch({ type: "REMOVE_FROM_COMPARELIST", payload: { id: id! } });
      }
    } else {
      setIsShown(true);
      console.log("popup");
    }
  }
  function handleDnd(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isCompared: boolean
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (isCompared) {
      async function removeFromDndLists() {
        await firebase.removeFromDndLists(userInfo.uid, id!);
      }
      removeFromDndLists();
      dispatch({ type: "REMOVE_FROM_DNDLISTS", payload: { id: id! } });
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
    startRent: number;
    endRent: number;
    totalSq: number;
    floor: number;
    moveInDate: Timestamp;
  };

  const [listingInfo, setListingInfo] = useState<ListingType>();
  const [bookingTimesInfo, setBookingTimesInfo] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [ableBookingTimes, setAbleBookingTimes] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [alreadyBookedPopup, setAlreadyBookedPopup] = useState<boolean>(false);
  const [checkIfUserCanBook, setCheckIfUserCanBook] = useState<boolean>(false);
  const [popImg, setPopImg] = useState<boolean>(false);
  const [clickOnImg, setClickOnImg] = useState<string>("");
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
  function clickOnImage(url: string) {
    setPopImg(true);
    setClickOnImg(url);
  }
  async function bookedTime(
    uid: string,
    docId: string,
    listingId: string,
    selectedDateTime: any
  ) {
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
      // console.log(data.moveInDate.toDateString());
      console.log(data.moveInDate.toDate());
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
            let findIndex = acc.findIndex(
              (item: any) =>
                item?.data().date.seconds === curr.data().date.seconds
            ); //console.log
            if (findIndex === -1) {
              acc.push(curr);
            } else {
            }
            return acc;
          }, []);
          setAbleBookingTimes(enableDate);
        }
        let enableDates = enableDate.map(
          (s: QueryDocumentSnapshot<DocumentData>) => {
            let date = s.data().date.toDate();
            return date;
          }
        );
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
      <IconArea>
        <FavoriteIcon
          onClick={(e) => handleLiked(e!, favoriteLists.includes(id!))}
          isLiked={favoriteLists.includes(id!)}
        ></FavoriteIcon>
        <CompareIcon
          onClick={(e) => {
            handleCompare(
              e!,
              compareLists.includes(id!) || dndLists.includes(id!)
            );
          }}
          isCompared={compareLists.includes(id!) || dndLists.includes(id!)}
        ></CompareIcon>
      </IconArea>
      {popImg && (
        <PopupImage img={clickOnImg} clickClose={() => setPopImg(false)} />
      )}
      {alreadyBookedPopup && (
        <PopupComponent
          msg={`一團只能預約一個時間哦!!`}
          notDefaultBtn={`確認`}
          defaultBtn={`回物件管理頁面取消`}
          clickClose={() => setAlreadyBookedPopup(false)}
          clickFunction={() => navigate("/profile")}
        />
      )}
      {isShown && (
        <PopupComponent
          // style={{ zIndex: '1' }}
          msg={`請先進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={() => setIsShown(false)}
          clickFunction={() => navigate("/signin")}
        />
      )}
      {/* <div>房源id:{id}</div> */}
      <ImagesWrapper>
        <ImageWrap>
          <MainImage
            src={listingInfo?.mainImage!}
            onClick={() => clickOnImage(listingInfo?.mainImage!)}
          />
        </ImageWrap>
        <OtherImagesWrapper>
          {listingInfo?.images &&
            listingInfo.images.map((src, index) => (
              <ImageWrap key={`images_${index}`}>
                <Images src={src} onClick={() => clickOnImage(src)} />
              </ImageWrap>
            ))}
        </OtherImagesWrapper>
      </ImagesWrapper>
      <DividedCalendarSection>
        {/* <InformationWrapper> */}
        <TitleWrapper>
          <Title>{listingInfo?.title}</Title>
          <AddrSection>
            <TitleDivide>
              <TitleInfoWrapper>
                {listingInfo?.countyName}
                {listingInfo?.townName}
              </TitleInfoWrapper>
              <TitleIconWrapper>
                <TitleIcon>{listingInfo?.form}</TitleIcon>
                <TitleIcon>{listingInfo?.totalSq}坪</TitleIcon>
                <TitleIcon>{listingInfo?.floor}樓</TitleIcon>
                <TitleIcon>{listingInfo?.peopleAmount}人可入住</TitleIcon>
                <TitleIcon>
                  {listingInfo?.moveInDate.toDate().toDateString()}起可入住
                  {/* {listingInfo?.moveInDate.toDate().getFullYear() +
                  '-' +
                  ('0' + (listingInfo?.moveInDate!.toDate().getMonth() + 1)).slice(-2) +
                  '-' +
                  ('0' + listingInfo?.moveInDate!.toDate().getDate()).slice(-2)} */}
                </TitleIcon>
              </TitleIconWrapper>
            </TitleDivide>

            <Rent>
              {listingInfo?.startRent}~{listingInfo?.endRent}/月
            </Rent>
          </AddrSection>
          <div style={{ margin: "20px 0px" }}>
            {listingInfo?.environmentDescription}
          </div>

          <RoommatesCondition
            roommatesConditions={listingInfo?.roommatesConditions}
          ></RoommatesCondition>
          <Group
            peopleAmount={listingInfo?.peopleAmount!}
            listingId={id!}
            listingTitle={listingInfo?.listingTitle!}
          ></Group>
          <Facility facility={listingInfo?.facility}></Facility>
          <RoomDetails room={listingInfo?.rentRoomDetails}></RoomDetails>
        </TitleWrapper>
        <StickyCalendarContainer>
          <SubTitle style={{ marginBottom: "20px" }}>
            預約看房
            <span style={{ fontSize: "16px", marginLeft: "20px" }}>
              剩下
              <span style={{ color: "#c77155 " }}>
                {
                  bookingTimesInfo.filter((el) => el.data().isBooked === false)
                    .length
                }
              </span>
              個時間可以預約
            </span>
          </SubTitle>

          {/* <Hr /> */}
          <CalendarContainer>
            <Calendar tileDisabled={tileDisabled} onClickDay={clickDate} />
          </CalendarContainer>
          <Times>
            {selectedDate && (
              <SelectedDate>
                {selectedDate.getFullYear() +
                  "-" +
                  ("0" + (selectedDate.getMonth() + 1)).slice(-2) +
                  "-" +
                  ("0" + selectedDate.getDate()).slice(-2)}
              </SelectedDate>
            )}
            {selectedDate &&
              bookingTimesInfo
                .filter(
                  (el) =>
                    el.data().date.toDate().getTime() !==
                      selectedDate.getTime() && el.data().isBooked === false
                )
                .map((el, index) => (
                  <SelectTimeWrapper key={`selectedTimes_${index}`}>
                    <SelectTime>{el.data().startTime}</SelectTime>
                    <CanBookedBtn
                      onClick={() =>
                        bookedTime(userInfo.uid, el.id, id!, {
                          date: el.data().date,
                          startTime: el.data().startTime,
                        })
                      }
                    >
                      預約
                    </CanBookedBtn>
                  </SelectTimeWrapper>
                ))}
            {selectedDate &&
              bookingTimesInfo
                .filter(
                  (el) =>
                    el.data().date.toDate().getTime() !==
                      selectedDate.getTime() && el.data().isBooked === true
                )
                .map((el, index) => (
                  <SelectTimeWrapper key={`selectedTimes_${index}`}>
                    <SelectTime>{el.data().startTime}</SelectTime>
                    <CannotBookedBtn>已被預約</CannotBookedBtn>
                  </SelectTimeWrapper>
                ))}
          </Times>
        </StickyCalendarContainer>
        {/* </InformationWrapper> */}
      </DividedCalendarSection>
      {/* <Hr style={{ margin: '40px 0px' }} /> */}
      {/* <SubmitBtn onClick={() => match()}>比對</SubmitBtn> */}
      {/* <SubTitle style={{ marginBottom: '32px' }}>地點</SubTitle> */}
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
