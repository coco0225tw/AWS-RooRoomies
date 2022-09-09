import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Map from './Map';
import CalendarContainer from '../../components/Calendar';
import { firebase } from '../../utils/firebase';
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
  flex-grow: 1;
  position: sticky;
  // width: 100%;
  // background-color: brown;
`;
function Listing() {
  const { id } = useParams<string>();
  type ListingType = {
    mainImage: string;
    images: string[];
    title: string;
  };

  const [listingInfo, setListingInfo] = useState<ListingType>();

  type tileDisabledType = { date: Date };
  const tileDisabled = ({ date }: tileDisabledType) => {
    const BookingDates = [new Date(2022, 8, 3), new Date(2022, 8, 8), new Date(2022, 8, 10)];
    return !BookingDates.some(
      (disabledDate) =>
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
    );
  };
  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType;
      setListingInfo(data);
    }
    getListing();
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
              <Calendar tileDisabled={tileDisabled} />
            </CalendarContainer>
          </StickyCalendarContainer>
        </InformationWrapper>
        <StickyCalendarContainer></StickyCalendarContainer>
      </DividedCalendarSection>
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
