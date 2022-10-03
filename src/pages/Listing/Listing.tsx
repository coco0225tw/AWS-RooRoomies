import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Map from "./Map";
import CalendarContainer from "../../components/Calendar";
import { firebase, db } from "../../utils/firebase";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue,
  onSnapshot,
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
import SpanLink from "../../components/SpanLink";
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
  row-gap: 3%;
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
const OtherImageWrap = styled(ImageWrap)`
  height: auto;
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
`;
const FavoriteIcon = styled(Icon)<{ isLiked: boolean }>`
  background-image: url(${(props) =>
    props.isLiked ? likedIcon : unLikedIcon});
`;

const CompareIcon = styled(Icon)<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
  margin-left: 12px;
`;
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
const Span = styled.span`
  font-size: 16px;
  letter-spacing: 1.2px;
  color: grey;
`;
function Listing() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const { id } = useParams<string>();
  const dispatch = useDispatch();
  const compareLists = useSelector(
    (state: RootState) => state.GetCompareListsReducer
  );
  const getGroup = useSelector(
    (state: RootState) => state.GroupReducer
  ) as Array<groupType>;
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
    if (authChange && !submitting) {
      setSubmitting(true);
      if (!isLiked) {
        async function addToFavoriteLists() {
          await firebase.addToFavoriteLists(userInfo.uid, id!);
        }
        addToFavoriteLists().then(() => {
          dispatch({ type: "ADD_TO_FAVORITELISTS", payload: { id: id! } });
          dispatch({
            type: "OPEN_NOTIFY_ALERT",
            payload: {
              alertMessage: "加入喜歡列表",
            },
          });
          setTimeout(() => {
            dispatch({
              type: "CLOSE_ALERT",
            });
          }, 3000);
          setSubmitting(false);
        });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, id!);
        }
        removeFromFavoriteLists().then(() => {
          dispatch({ type: "REMOVE_FROM_FAVORITELISTS", payload: { id: id! } });
          dispatch({
            type: "OPEN_NOTIFY_ALERT",
            payload: {
              alertMessage: "從喜歡列表刪除",
            },
          });
          setTimeout(() => {
            dispatch({
              type: "CLOSE_ALERT",
            });
            setSubmitting(false);
          }, 3000);
        });
      }
    } else if (!authChange) {
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
    // title: string;
    startRent: number;
    endRent: number;
    totalSq: number;
    floor: number;
    moveInDate: string;
    latLng: { lat: number; lng: number };
  };
  const [hintTextLoading, setHintTextLoading] = useState<boolean>(false);
  const [listingInfo, setListingInfo] = useState<ListingType>();
  const [bookingTimesInfo, setBookingTimesInfo] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [ableBookingTimes, setAbleBookingTimes] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  // const [alreadyBookedPopup, setAlreadyBookedPopup] = useState<boolean>(false);
  // const [checkIfUserCanBook, setCheckIfUserCanBook] = useState<boolean>(false);
  const [popImg, setPopImg] = useState<boolean>(false);
  const [clickOnImg, setClickOnImg] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookedTimePopup, setBookedTimePopup] = useState<boolean>(false);
  const [bookTimeInfo, setBookTimeInfo] = useState<{
    uid: string;
    docId: string;
    listingId: string;
    selectedDateTime: any;
  }>();
  //條件
  const [addUserAsRoommatesCondition, setAddUserAsRoommatesCondition] =
    useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);
  const [isInGroup, setIsInGroup] = useState<boolean>(false);
  const [isInFullGroup, setIsInFullGroup] = useState<boolean>(false);
  const [canBook, setCanBook] = useState<boolean>(false);
  //
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
    bookTimeInfo
    // uid: string,
    // docId: string,
    // listingId: string,
    // selectedDateTime: any
  ) {
    setHintTextLoading(true);
    let chatRoomId!: string;
    let groupId!: number;
    console.log(bookTimeInfo.listingId);
    console.log(bookTimeInfo.docId);
    console.log(
      getGroup.find((g) => g.users.some((u) => u && u.userId === userInfo.uid))
        .chatRoomId
    );
    chatRoomId = getGroup.find((g) =>
      g.users.some((u) => u && u.userId === userInfo.uid)
    ).chatRoomId;
    groupId = getGroup.findIndex((g) =>
      g.users.some((u) => u && u.userId === userInfo.uid)
    );
    let newGroup = [...getGroup];
    newGroup[groupId].isBooked = true;
    async function updateAllBookedTime() {
      Promise.all([
        firebase.bookedTime(bookTimeInfo.listingId, bookTimeInfo.docId),
        firebase.bookedTimeInChatRoom(
          chatRoomId as string,
          bookTimeInfo.selectedDateTime
        ),
        firebase.bookedTimeInMatch(bookTimeInfo.listingId, newGroup),
      ]).then(() => {
        dispatch({
          type: "OPEN_SUCCESS_ALERT",
          payload: {
            alertMessage: "預約成功",
          },
        });
        setBookedTimePopup(false);
        setTimeout(() => {
          dispatch({
            type: "CLOSE_ALERT",
          });
          setCanBook(false);
          setHintTextLoading(false);
        }, 3000);
      });
    }
    updateAllBookedTime();
  }
  function notAddUserAsRoommatesConditionAlert() {
    dispatch({
      type: "OPEN_NOTIFY_ALERT",
      payload: {
        alertMessage: (
          <Span
            style={{
              fontSize: "inherit",
              letterSpacing: "inherit",
              color: "inherit",
            }}
          >
            尚未填寫條件,到
            <SpanLink
              path={"/profile"}
              msg={"個人頁面"}
              otherFn={dispatch({
                type: "SELECT_TYPE",
                payload: { tab: "aboutMe" },
              })}
            />
            更新
          </Span>
        ),
      },
    });
    setTimeout(() => {
      dispatch({
        type: "CLOSE_ALERT",
      });
    }, 3000);
  }
  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType | boolean;
      if (data) {
        setListingInfo(data as ListingType);
      } else {
      }
    }
    const subColRef = collection(db, "listings", id!, "bookingTimes");
    const getAllMessages = onSnapshot(subColRef, (snapshot) => {
      let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
      snapshot.forEach((doc) => {
        listingTimesArr.push(doc);
      });
      // setBookingTimesInfo(listingTimesArr);
      console.log(listingTimesArr);
    });
    // async function getBookingTimes() {
    function getBookingTimes() {
      const getAllMessages = onSnapshot(subColRef, (snapshot) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        snapshot.forEach((doc) => {
          listingTimesArr.push(doc);
        });
        // setBookingTimesInfo(listingTimesArr);
        console.log(listingTimesArr);
        //  });
        // await firebase.getBookingTimesSubColForListing(id!).then((times) => {
        //   let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        //   times.forEach((doc) => {
        //     listingTimesArr.push(doc);
        //   });
        //   console.log(listingTimesArr);
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
      // await Promise.all([getBookingTimes(), getListing()]);
      // await check(userInfo.uid, id!);
      getListing();
    }
    getBookingTimes();

    promise();
  }, [id]);
  return (
    <Wrapper>
      <IconArea>
        <FavoriteIcon
          onClick={(e) => handleLiked(e!, favoriteLists.includes(id!))}
          isLiked={favoriteLists.includes(id!)}
        ></FavoriteIcon>
        {/* <CompareIcon
          onClick={(e) => {
            handleCompare(
              e!,
              compareLists.includes(id!) || dndLists.includes(id!)
            );
          }}
          isCompared={compareLists.includes(id!) || dndLists.includes(id!)}
        ></CompareIcon> */}
      </IconArea>
      {popImg && (
        <PopupImage img={clickOnImg} clickClose={() => setPopImg(false)} />
      )}
      {/* {alreadyBookedPopup && (
        <PopupComponent
          msg={`一團只能預約一個時間哦!!`}
          notDefaultBtn={`確認`}
          defaultBtn={`回物件管理頁面取消`}
          clickClose={() => setAlreadyBookedPopup(false)}
          clickFunction={() => navigate("/profile")}
        />
      )} */}
      {bookedTimePopup && (
        <PopupComponent
          msg={`確認預約?`}
          notDefaultBtn={`取消`}
          defaultBtn={`確認`}
          clickClose={() => setBookedTimePopup(false)}
          clickFunction={() => bookedTime(bookTimeInfo)}
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
              <OtherImageWrap key={`images_${index}`}>
                <Images src={src} onClick={() => clickOnImage(src)} />
              </OtherImageWrap>
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
                <TitleIcon>{listingInfo?.moveInDate}起可入住</TitleIcon>
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
            match={match}
            setMatch={setMatch}
            addUserAsRoommatesCondition={addUserAsRoommatesCondition}
            setAddUserAsRoommatesCondition={setAddUserAsRoommatesCondition}
          ></RoommatesCondition>
          <Group
            match={match}
            setMatch={setMatch}
            peopleAmount={listingInfo?.peopleAmount!}
            listingId={id!}
            listingTitle={listingInfo?.title as string}
            addUserAsRoommatesCondition={addUserAsRoommatesCondition}
            setAddUserAsRoommatesCondition={setAddUserAsRoommatesCondition}
            notAddUserAsRoommatesConditionAlert={
              notAddUserAsRoommatesConditionAlert
            }
            isInGroup={isInGroup}
            setIsInGroup={setIsInGroup}
            isInFullGroup={isInFullGroup}
            setIsInFullGroup={setIsInFullGroup}
            canBook={canBook}
            setCanBook={setCanBook}
            hintTextLoading={hintTextLoading}
            setHintTextLoading={setHintTextLoading}
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
                    el.data().date.toDate().getTime() ===
                      selectedDate.getTime() && el.data().isBooked === false
                )
                .map((el, index) => (
                  <SelectTimeWrapper key={`selectedTimes_${index}`}>
                    <SelectTime>{el.data().startTime}</SelectTime>
                    <CanBookedBtn
                      onClick={() => {
                        if (!canBook) {
                          if (!authChange) setIsShown(true);
                          if (!addUserAsRoommatesCondition)
                            notAddUserAsRoommatesConditionAlert();
                          if (!match) {
                            dispatch({
                              type: "OPEN_ERROR_ALERT",
                              payload: {
                                alertMessage: "條件不符，不能湊團預約",
                              },
                            });
                            setTimeout(() => {
                              dispatch({
                                type: "CLOSE_ALERT",
                              });
                            }, 3000);
                            return;
                          }
                          if (!isInGroup) {
                            console.log(!isInGroup);
                            dispatch({
                              type: "OPEN_ERROR_ALERT",
                              payload: {
                                alertMessage: "請先加入團再預約",
                              },
                            });
                            setTimeout(() => {
                              dispatch({
                                type: "CLOSE_ALERT",
                              });
                            }, 3000);
                            return;
                          }
                          if (!isInFullGroup) {
                            dispatch({
                              type: "OPEN_ERROR_ALERT",
                              payload: {
                                alertMessage: "尚未湊滿團，無法預約",
                              },
                            });
                            setTimeout(() => {
                              dispatch({
                                type: "CLOSE_ALERT",
                              });
                            }, 3000);
                            return;
                          }
                          dispatch({
                            type: "OPEN_ERROR_ALERT",
                            payload: {
                              alertMessage: "已經預約過",
                            },
                          });
                          setTimeout(() => {
                            dispatch({
                              type: "CLOSE_ALERT",
                            });
                          }, 3000);
                          return;
                        } else {
                          console.log("可以預約");
                          setBookedTimePopup(true);
                          setBookTimeInfo({
                            uid: userInfo.uid,
                            docId: el.id,
                            listingId: id!,
                            selectedDateTime: {
                              date: el.data().date,
                              startTime: el.data().startTime,
                            },
                          });
                          // bookedTime(userInfo.uid, el.id, id!, {
                          //   date: el.data().date,
                          //   startTime: el.data().startTime,
                          // });
                        }
                      }}
                    >
                      預約
                    </CanBookedBtn>
                  </SelectTimeWrapper>
                ))}
            {selectedDate &&
              bookingTimesInfo
                .filter(
                  (el) =>
                    el.data().date.toDate().getTime() ===
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
      <Map latLng={listingInfo?.latLng!}></Map>
    </Wrapper>
  );
}

export default Listing;
