import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

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
  };
  const [listingInfo, setListingInfo] = useState<ListingType>();
  useEffect(() => {
    async function getListing() {
      const data = (await firebase.getListing(id!)) as ListingType;
      setListingInfo(data);
    }
    getListing();
  }, [id]);
  return (
    <Wrapper>
      <div>主要照片</div>
      <MainImage src={listingInfo?.mainImage} />
      <div>其他照片</div>
      {listingInfo?.images && listingInfo.images.map((src) => <Images src={src} />)}
    </Wrapper>
  );
}

export default Listing;
