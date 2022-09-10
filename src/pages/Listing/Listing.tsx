import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Map from './Map';
import CalendarContainer from '../../components/Calendar';
import { firebase } from '../../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import bookingTimesType from '../../redux/UploadBookingTimes/UploadBookingTimesType';
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
  flex-wrap: wrap;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
`;

const DividedCalendarSection = styled(SectionWrapper)`
  // flex-direction: row;
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
  const { id } = useParams<string>();
  type ListingType = {
    mainImage: string;
    images: string[];
    title: string;
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
  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType;
      setListingInfo(data);
    }

    async function getBookingTimes() {
      firebase.getBookingTimesSubColForListing(id!).then((times) => {
        let listingTimesArr: QueryDocumentSnapshot<DocumentData>[] = [];
        times.forEach((doc) => {
          listingTimesArr.push(doc);
          console.log(doc.data().date.toDate());
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
          console.log(date);
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
          <Title>{listingInfo?.title}</Title>
          {/* <AddrSection></AddrSection> */}
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
                  {/* {selectedDate.toDateString()} */}
                </SelectedDate>
              )}
              {selectedDate &&
                bookingTimesInfo
                  .filter((el) => el.data().date.toDate().getTime() !== selectedDate.getTime())
                  .map((el, index) => (
                    <SectionWrapper key={`selectedTimes_${index}`}>
                      <div>{el.data().startTime}</div>
                      <SubmitBtn>預約</SubmitBtn>
                    </SectionWrapper>
                  ))}
            </Times>
          </StickyCalendarContainer>
        </InformationWrapper>
        <StickyCalendarContainer></StickyCalendarContainer>
      </DividedCalendarSection>
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
