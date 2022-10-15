import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, DocumentData, QueryDocumentSnapshot, onSnapshot, Timestamp } from 'firebase/firestore';
import { firebase, db } from '../../utils/firebase';
import { RootState } from '../../redux/rootReducer';
import { alertActionType } from '../../redux/Alert/AlertAction';
import { getFavoriteAction } from '../../redux/GetFavoriteListing/GetFavoriteListingAction';
import { selectTabAction } from '../../redux/SelectTab/SelectTabAction';

import Calendar from 'react-calendar';
import Map from './Map';
import CalendarContainer from '../../components/Calendar';
import RoommatesCondition from './RoommatesCondition';
import Facility from './Facility';
import RoomDetails from './RoomDetails';
import Group from './Group';

import likedIcon from '../../assets/heart.png';
import unLikedIcon from '../../assets/unHeart.png';

import { BtnDiv } from '../../components/Button';
import { PopupComponent, PopupImage } from '../../components/Popup';
import Hr from '../../components/Hr';
import SpanLink from '../../components/SpanLink';

import { groupsType } from '../../redux/Group/GroupType';
import { roomDetailsType } from '../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';

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
  @media screen and (max-width: 1460px) {
    width: 90%;
  }
  @media screen and (max-width: 1200px) {
    margin-top: 20px;
  }
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
  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
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
  @media screen and (max-width: 1200px) {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 28%;
    padding: 10px 0;
    gap: 10px;
  }
`;
const TitleWrapper = styled(SectionWrapper)`
  font-size: 20px;
  flex-direction: column;
  width: 60%;
  @media screen and (max-width: 1460px) {
    width: 100%;
  }
`;

const DividedCalendarSection = styled(SectionWrapper)`
  flex-direction: row;
  margin: 20px 0px 32px;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1460px) {
    flex-direction: column;
  }
`;

const SelectTimeWrapper = styled(SectionWrapper)`
  width: 48%;
  border-bottom: solid 1px #c77155;
  padding: 10px 0px;
  color: #4f5152;
  transition: 0.2s;
  justify-content: space-between;
  align-items: baseline;
  @media screen and (max-width: 1460px) {
    width: 40%;
    margin-top: 20px;
  }
  @media screen and (max-width: 920px) {
    width: 100%;
  }
`;

const ImageWrap = styled.div`
  width: 49%;
  cursor: pointer;
  overflow: hidden;
  height: 100%;

  @media screen and (max-width: 1200px) {
    width: 100%;
    flex-grow: 1;
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
    filter: brightness(70%);
  }
`;
const Images = styled(MainImage)`
  width: 49%;
  cursor: pointer;
  overflow: hidden;
  height: 100%;
  &:hover {
    filter: brightness(70%);
    transform: scale(100%);
    /* background-size: 120%; */
  }
  height: auto;
  aspect-ratio: 1 / 1;
  @media screen and (max-width: 1200px) {
    width: 100px;
    min-width: 100px;
  }
`;

const Title = styled.div`
  font-size: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const AddrSection = styled(SectionWrapper)`
  width: 100%;
  justify-content: space-between;
  margin-top: 32px;
  align-self: flex-start;
  flex-direction: column;
`;
const StickyCalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  position: sticky;
  top: 100px;
  align-self: flex-start;
  width: calc(350px + 40px + 20px);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
  border-radius: 20px;
  @media screen and (max-width: 1460px) {
    position: static;
    margin-top: 10vh;
    width: 100%;
    box-shadow: none;
    padding: 0;
    top: 120px;
  }
  @media screen and (max-width: 960px) {
    margin-top: 40px;
  }
`;

const Times = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 32px;
  /* height: auto; */
  @media screen and (max-width: 1460px) {
    padding-left: 20px;
    align-items: flex-start;
    padding-top: 0;
  }
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
  @media screen and (max-width: 650px) {
    padding-left: 0px;
    padding-top: 32px;
    width: 350px;
  }
  @media screen and (max-width: 420px) {
    width: 100%;
    padding-top: 0px;
  }
`;
const SelectedDate = styled.div`
  font-size: 20px;
  color: #4f5152;
  width: 100%;
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
  background-image: url(${(props) => (props.isLiked ? likedIcon : unLikedIcon)});
`;

const SubTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #4f5152;
  width: 100%;
`;

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
const IconArea = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: end;
  transition-duration: 0.2s;
  align-self: flex-end;
  width: 100%;
  height: 52px;
  padding-bottom: 12px;
`;
const Rent = styled.div`
  color: #c77155;
  font-size: 28px;
  position: absolute;
  right: 0;
  @media screen and (max-width: 660px) {
    position: relative;
    align-self: flex-start;
    margin-top: 20px;
  }
`;

const TitleInfoWrapper = styled(SectionWrapper)`
  align-items: center;
  width: auto;
`;
const TitleIcon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  & + & {
    border-left: solid 3px #c77155;
    padding-left: 12px;
  }
`;
const TitleIconWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  @media screen and (max-width: 900px) {
    flex-wrap: wrap;
  }
`;
const Span = styled.span`
  font-size: 16px;
  letter-spacing: 1.2px;
  color: grey;
`;
const StyledSubTitle = styled(SubTitle)`
  font-weight: normal;
`;
const TimeAndCalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  @media screen and (max-width: 1460px) {
    flex-direction: row;
  }
  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
`;
const StyledHr = styled(Hr)`
  display: none;
  @media screen and (max-width: 1460px) {
    display: block;
    margin: 40px 0;
  }
`;
const OtherImageWrap = styled(MainImage)`
  width: 49%;
  cursor: pointer;
  overflow: hidden;
  height: 100%;
  &:hover {
    filter: brightness(70%);
  }
  height: auto;
  aspect-ratio: 1 / 1;
  @media screen and (max-width: 1200px) {
    width: 100px;
    min-width: 100px;
  }
`;
function Listing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<string>();

  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const getGroup = useSelector((state: RootState) => state.GroupReducer) as groupsType;
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);

  const [isShown, setIsShown] = useState<boolean>(false);
  const [hintTextLoading, setHintTextLoading] = useState<boolean>(false);
  const [listingInfo, setListingInfo] = useState<ListingType>();
  const [bookingTimesInfo, setBookingTimesInfo] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [ableBookingTimes, setAbleBookingTimes] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [popImg, setPopImg] = useState<boolean>(false);
  const [clickOnImg, setClickOnImg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookedTimePopup, setBookedTimePopup] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<null | Date>(null);
  type selectDateTimeType = {
    date: Timestamp;
    startTime: string;
  };
  const [bookTimeInfo, setBookTimeInfo] = useState<{
    uid: string;
    docId: string;
    listingId: string;
    selectedDateTime: selectDateTimeType;
  }>();
  const [addUserAsRoommatesCondition, setAddUserAsRoommatesCondition] = useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);
  const [isInGroup, setIsInGroup] = useState<boolean>(false);
  const [isInFullGroup, setIsInFullGroup] = useState<boolean>(false);
  const [canBook, setCanBook] = useState<boolean>(false);
  type tileDisabledType = { date: Date };

  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isLiked: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange && !submitting) {
      setSubmitting(true);
      if (!isLiked) {
        async function addToFavoriteLists() {
          await firebase.addToFavoriteLists(userInfo.uid, id!);
        }
        addToFavoriteLists().then(() => {
          dispatch({
            type: getFavoriteAction.ADD_TO_FAVORITE_LISTS,
            payload: { id: id! },
          });
          dispatch({
            type: alertActionType.OPEN_NOTIFY_ALERT,
            payload: {
              alertMessage: '加入喜歡列表',
            },
          });
          setTimeout(() => {
            dispatch({
              type: alertActionType.CLOSE_ALERT,
            });
          }, 3000);
          setSubmitting(false);
        });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, id!);
        }
        removeFromFavoriteLists().then(() => {
          dispatch({
            type: getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS,
            payload: { id: id! },
          });
          dispatch({
            type: alertActionType.OPEN_NOTIFY_ALERT,
            payload: {
              alertMessage: '從喜歡列表刪除',
            },
          });
          setTimeout(() => {
            dispatch({
              type: alertActionType.CLOSE_ALERT,
            });
            setSubmitting(false);
          }, 3000);
        });
      }
    } else if (!authChange) {
      setIsShown(true);
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
    matchGroup: groupsType;
    startRent: number;
    endRent: number;
    totalSq: number;
    floor: number;
    moveInDate: Timestamp;
    latLng: { lat: number; lng: number };
    totalFloor: number;
  };

  const tileDisabled = ({ date }: tileDisabledType) => {
    if (ableBookingTimes.length !== 0) {
      return !ableBookingTimes.some(
        (disabledDate) =>
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
  async function bookedTime(bookTimeInfo) {
    setHintTextLoading(true);
    let chatRoomId!: string;
    let groupId!: number;
    chatRoomId = getGroup.find((g) => g.users.some((u) => u && u.userId === userInfo.uid)).chatRoomId;
    groupId = getGroup.findIndex((g) => g.users.some((u) => u && u.userId === userInfo.uid));
    let newGroup = [...getGroup];
    newGroup[groupId].isBooked = true;
    async function updateAllBookedTime() {
      Promise.all([
        firebase.bookedTime(bookTimeInfo.listingId, bookTimeInfo.docId),
        firebase.bookedTimeInChatRoom(chatRoomId as string, bookTimeInfo.selectedDateTime),
        firebase.bookedTimeInMatch(bookTimeInfo.listingId, newGroup),
      ]).then(() => {
        dispatch({
          type: alertActionType.OPEN_SUCCESS_ALERT,
          payload: {
            alertMessage: '預約成功',
          },
        });
        setBookedTimePopup(false);
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
          setCanBook(false);
          setHintTextLoading(false);
        }, 3000);
      });
    }
    updateAllBookedTime();
  }
  const findMinCanBookDate = (bookingTimesInfo: QueryDocumentSnapshot<DocumentData>[]) => {
    let canBook = bookingTimesInfo.filter((el) => el.data().isBooked === false);
    if (canBook.length === 0) {
      let startDate = bookingTimesInfo
        .map((time, index) => time.data().date.toDate())
        .reduce((a, b) => (a < b ? a : b));
      setStartDate(startDate);
    } else {
      let startDate = canBook.map((time, index) => time.data().date.toDate()).reduce((a, b) => (a < b ? a : b));
      setStartDate(startDate);
    }
  };
  function notAddUserAsRoommatesConditionAlert() {
    dispatch({
      type: alertActionType.OPEN_NOTIFY_ALERT,
      payload: {
        alertMessage: (
          <Span
            style={{
              fontSize: 'inherit',
              letterSpacing: 'inherit',
              color: 'inherit',
            }}
          >
            尚未填寫條件,到
            <SpanLink
              path={'/profile'}
              msg={'個人頁面'}
              otherFn={dispatch({
                type: selectTabAction.SELECT_TYPE,
                payload: { tab: 'aboutMe' },
              })}
            />
            更新
          </Span>
        ),
      },
    });
    setTimeout(() => {
      dispatch({
        type: alertActionType.CLOSE_ALERT,
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
    const subColRef = collection(db, 'listings', id!, 'bookingTimes');
    const getAllMessages = onSnapshot(subColRef, (snapshot) => {
      let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
      snapshot.forEach((doc) => {
        listingTimesArr.push(doc);
      });
    });
    function getBookingTimes() {
      const getAllMessages = onSnapshot(subColRef, (snapshot) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        snapshot.forEach((doc) => {
          listingTimesArr.push(doc);
        });
        setBookingTimesInfo(listingTimesArr);
        findMinCanBookDate(listingTimesArr);
        let enableDate = [];
        if (listingTimesArr?.length !== 0) {
          enableDate = listingTimesArr?.reduce(
            (acc: QueryDocumentSnapshot<DocumentData>[], curr: QueryDocumentSnapshot<DocumentData>) => {
              let findIndex = acc.findIndex(
                (item: QueryDocumentSnapshot<DocumentData>) => item?.data().date.seconds === curr.data().date.seconds
              );
              if (findIndex === -1) {
                acc.push(curr);
              } else {
              }
              return acc;
            },
            []
          );
          setAbleBookingTimes(enableDate);
        }
        let enableDates = enableDate.map((s: QueryDocumentSnapshot<DocumentData>) => {
          let date = s.data().date.toDate();
          return date;
        });
        setAbleBookingTimes(enableDates);
      });
    }
    // async function promise() {
    getListing();
    // }

    getBookingTimes();

    // promise();
  }, [id]);
  return (
    <Wrapper>
      <IconArea>
        <FavoriteIcon
          onClick={(e) => handleLiked(e!, favoriteLists.includes(id!))}
          isLiked={favoriteLists.includes(id!)}
        />
      </IconArea>
      {popImg && <PopupImage img={clickOnImg} clickClose={() => setPopImg(false)} />}
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
          msg={`請先進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={() => setIsShown(false)}
          clickFunction={() => navigate('/signin')}
        />
      )}

      <ImagesWrapper>
        <ImageWrap>
          <MainImage src={listingInfo?.mainImage!} onClick={() => clickOnImage(listingInfo?.mainImage!)} />
        </ImageWrap>
        <OtherImagesWrapper>
          {listingInfo?.images &&
            listingInfo.images.map((src, index) => (
              // <OtherImageWrap key={`images_${index}`}>
              <Images src={src} key={`images_${index}`} onClick={() => clickOnImage(src)} />
              // </OtherImageWrap>
            ))}
        </OtherImagesWrapper>
      </ImagesWrapper>
      <DividedCalendarSection>
        <TitleWrapper>
          <Title>{listingInfo?.title}</Title>
          <AddrSection>
            <TitleInfoWrapper>
              {listingInfo?.countyName}
              {listingInfo?.townName}
            </TitleInfoWrapper>
            <Rent>
              {listingInfo?.startRent}~{listingInfo?.endRent}/月
            </Rent>
            <TitleIconWrapper>
              <TitleIcon>{listingInfo?.form}</TitleIcon>
              <TitleIcon>{listingInfo?.totalSq}坪</TitleIcon>
              <TitleIcon>
                {listingInfo?.floor}
                {listingInfo?.totalFloor && `/${listingInfo?.totalFloor}`}F
              </TitleIcon>
              <TitleIcon>{listingInfo?.peopleAmount}人可入住</TitleIcon>
              <TitleIcon>
                {listingInfo?.moveInDate.toDate().getFullYear() +
                  '-' +
                  ('0' + (listingInfo?.moveInDate.toDate().getMonth() + 1)).slice(-2) +
                  '-' +
                  ('0' + listingInfo?.moveInDate.toDate().getDate()).slice(-2)}
              </TitleIcon>
            </TitleIconWrapper>
          </AddrSection>
          <div style={{ margin: '20px 0px' }}>{listingInfo?.environmentDescription}</div>

          <RoommatesCondition
            roommatesConditions={listingInfo?.roommatesConditions}
            setMatch={setMatch}
            setAddUserAsRoommatesCondition={setAddUserAsRoommatesCondition}
          ></RoommatesCondition>
          <Group
            match={match}
            peopleAmount={listingInfo?.peopleAmount!}
            listingId={id!}
            listingTitle={listingInfo?.title as string}
            addUserAsRoommatesCondition={addUserAsRoommatesCondition}
            notAddUserAsRoommatesConditionAlert={notAddUserAsRoommatesConditionAlert}
            isInGroup={isInGroup}
            setIsInGroup={setIsInGroup}
            isInFullGroup={isInFullGroup}
            setIsInFullGroup={setIsInFullGroup}
            canBook={canBook}
            setCanBook={setCanBook}
            hintTextLoading={hintTextLoading}
            setHintTextLoading={setHintTextLoading}
          />
          <Facility facility={listingInfo?.facility} />
          <RoomDetails rooms={listingInfo?.rentRoomDetails} />
        </TitleWrapper>
        <StickyCalendarContainer>
          <StyledHr />
          <StyledSubTitle style={{ marginBottom: '20px' }}>
            預約看房
            <span style={{ fontSize: '16px', marginLeft: '20px' }}>
              剩下
              <span style={{ color: '#c77155 ' }}>
                {bookingTimesInfo.filter((el) => el.data().isBooked === false).length}
              </span>
              個時間可以預約
            </span>
          </StyledSubTitle>

          <TimeAndCalendarWrapper>
            <CalendarContainer>
              <Calendar
                defaultValue={startDate}
                minDetail="month"
                view="month"
                tileDisabled={tileDisabled}
                onClickDay={clickDate}
                tileClassName={({ date, view }) => {
                  const dateInfo = bookingTimesInfo.filter(
                    (doc) => doc.data().date.toDate().getTime() === date.getTime()
                  );
                  if (dateInfo.length !== 0 && dateInfo.every((doc) => doc.data().isBooked === true)) {
                    return 'highlight';
                  }
                }}
              />
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
                    (el) => el.data().date.toDate().getTime() === selectedDate.getTime() && el.data().isBooked === false
                  )
                  .map((el, index) => (
                    <SelectTimeWrapper key={`selectedTimes_${index}`}>
                      <SelectTime>{el.data().startTime}</SelectTime>
                      <CanBookedBtn
                        onClick={() => {
                          if (!canBook) {
                            if (!authChange) setIsShown(true);
                            if (!addUserAsRoommatesCondition) notAddUserAsRoommatesConditionAlert();
                            if (!match) {
                              dispatch({
                                type: alertActionType.OPEN_ERROR_ALERT,
                                payload: {
                                  alertMessage: '條件不符，不能湊團預約',
                                },
                              });
                              setTimeout(() => {
                                dispatch({
                                  type: alertActionType.CLOSE_ALERT,
                                });
                              }, 3000);
                              return;
                            }
                            if (!isInGroup) {
                              dispatch({
                                type: alertActionType.OPEN_ERROR_ALERT,
                                payload: {
                                  alertMessage: '請先加入團再預約',
                                },
                              });
                              setTimeout(() => {
                                dispatch({
                                  type: alertActionType.CLOSE_ALERT,
                                });
                              }, 3000);
                              return;
                            }
                            if (!isInFullGroup) {
                              dispatch({
                                type: alertActionType.OPEN_ERROR_ALERT,
                                payload: {
                                  alertMessage: '尚未湊滿團，無法預約',
                                },
                              });
                              setTimeout(() => {
                                dispatch({
                                  type: alertActionType.CLOSE_ALERT,
                                });
                              }, 3000);
                              return;
                            }
                            dispatch({
                              type: alertActionType.OPEN_ERROR_ALERT,
                              payload: {
                                alertMessage: '已經預約過',
                              },
                            });
                            setTimeout(() => {
                              dispatch({
                                type: alertActionType.CLOSE_ALERT,
                              });
                            }, 3000);
                            return;
                          } else {
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
                    (el) => el.data().date.toDate().getTime() === selectedDate.getTime() && el.data().isBooked === true
                  )
                  .map((el, index) => (
                    <SelectTimeWrapper key={`selectedTimes_${index}`}>
                      <SelectTime>{el.data().startTime}</SelectTime>
                      <CannotBookedBtn>已被預約</CannotBookedBtn>
                    </SelectTimeWrapper>
                  ))}
            </Times>
          </TimeAndCalendarWrapper>
        </StickyCalendarContainer>
      </DividedCalendarSection>
      <Map latLng={listingInfo?.latLng!}></Map>
    </Wrapper>
  );
}

export default Listing;
