import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Map from './Map';
import firebase from '../../utils/firebase';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;
const MainImage = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 30vw;
`;
const Images = styled(MainImage)``;
function Listing() {
  const { id } = useParams<string>();
  type ListingType = {
    mainImage: string;
    images: string[];
    id: string;
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
      <div>房源id:{listingInfo?.id}</div>
      <Calendar tileDisabled={tileDisabled} />
      <div>主要照片</div>
      <MainImage src={listingInfo?.mainImage} />
      <div>其他照片</div>
      {listingInfo?.images && listingInfo.images.map((src, index) => <Images key={`images_${index}`} src={src} />)}
      <Map></Map>
    </Wrapper>
  );
}

export default Listing;
