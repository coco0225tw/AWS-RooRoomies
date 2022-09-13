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

import { groupType, userInfoType } from '../../redux/Group/GroupType';
import roomDetailsType from '../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import bookingTimesType from '../../redux/UploadBookingTimes/UploadBookingTimesType';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';
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
  // flex-wrap: wrap;
  // height: 100%;
  // overflow: scroll;
  // overflow-x: hidden;
  flex-direction: column;
  // align-items: flex-start;
`;

const DividedCalendarSection = styled(SectionWrapper)`
  flex-direction: row;
  align-items: flex-start;
  // background-color: grey;
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
`;
const Title = styled.div`
  font-size: 40px;
  //width: 100%;
`;
const AddrSection = styled(SectionWrapper)``;
const StickyCalendarContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: start;
  // position: sticky;
  // width: 100%;
  // background-color: brown;
  // background-color: black;
`;

const Times = styled.div``;
const SelectedDate = styled.div`
  font-size: 20px;
`;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;
const IsBookedTimes = styled.div``;
function Listing() {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const { id } = useParams<string>();
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
  };

  const [listingInfo, setListingInfo] = useState<ListingType>();
  const [bookingTimesInfo, setBookingTimesInfo] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [ableBookingTimes, setAbleBookingTimes] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
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
    await firebase.checkIfUserCanBook(uid, listingId).then((listing) => {
      let isBooked;
      listing.forEach((doc) => {
        isBooked = doc.data().isBooked;
        chatRoomId = doc.id;
        userId = doc.data().userId;
      });
      if (isBooked === false) {
        window.alert('確定預約?');
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
        console.log('第一次預約');
      } else {
        window.alert('一團只能預約一次哦');
        console.log('重複預約');
      }
    });
  }

  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType;
      // console.log(data);
      setListingInfo(data);
    }

    async function getBookingTimes() {
      firebase.getBookingTimesSubColForListing(id!).then((times) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        times.forEach((doc) => {
          listingTimesArr.push(doc);
          // console.log(doc.data().date.toDate());
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
          // console.log(date);
          return date;
        });
        setAbleBookingTimes(enableDates);
      });
    }

    Promise.all([getBookingTimes(), getListing()]);
  }, [id]);
  return (
    <Wrapper>
      <div>房源id:{id}</div>
      <ImagesWrapper>
        <MainImage src={listingInfo?.mainImage} />
        <OtherImagesWrapper>
          {listingInfo?.images && listingInfo.images.map((src, index) => <Images key={`images_${index}`} src={src} />)}
        </OtherImagesWrapper>
      </ImagesWrapper>
      <DividedCalendarSection>
        <InformationWrapper>
          <TitleWrapper>
            <Title>{listingInfo?.title}</Title>
            <AddrSection>
              {listingInfo?.countyName}
              {listingInfo?.townName}
              <br />
              {listingInfo?.form}
              <br />
              {listingInfo?.environmentDescription}
            </AddrSection>
            <RoommatesCondition roommatesConditions={listingInfo?.roommatesConditions}></RoommatesCondition>
            <Group peopleAmount={listingInfo?.peopleAmount!} listingId={id!}></Group>
            <Facility facility={listingInfo?.facility}></Facility>
            <RoomDetails room={listingInfo?.rentRoomDetails}></RoomDetails>
          </TitleWrapper>
          <StickyCalendarContainer>
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
                    <SectionWrapper key={`selectedTimes_${index}`}>
                      <div>{el.data().startTime}</div>
                      <SubmitBtn
                        onClick={() =>
                          bookedTime(userInfo.uid, el.id, id!, { date: el.data().date, startTime: el.data().startTime })
                        }
                      >
                        預約
                      </SubmitBtn>
                    </SectionWrapper>
                  ))}
              {selectedDate &&
                bookingTimesInfo
                  .filter(
                    (el) => el.data().date.toDate().getTime() !== selectedDate.getTime() && el.data().isBooked === true
                  )
                  .map((el, index) => (
                    <SectionWrapper key={`selectedTimes_${index}`}>
                      <div>{el.data().startTime}</div>
                      <div>已預約</div>
                    </SectionWrapper>
                  ))}
            </Times>
          </StickyCalendarContainer>
        </InformationWrapper>
      </DividedCalendarSection>
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
