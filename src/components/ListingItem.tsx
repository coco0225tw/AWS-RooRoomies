import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DocumentData } from 'firebase/firestore';

import { PopupComponent } from './Popup';

interface ImgProps {
  img: string;
}
const Wrapper = styled.div`
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  color: #4f5152;
  font-size: 16px;
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  background-image: url(${(props) => (props.img ? props.img : '')});
  height: 200px;

  background-position: cover;
  background-size: 100% 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 20px;
  color: #4f5152;
  letter-spacing: 2px;
  font-weight: 600;
`;
const Detail = styled.div`
  margin-top: 12px;
`;
const Time = styled(Detail)``;

const Rent = styled.div`
  font-size: 28px;
  color: #c77155;
  align-self: flex-end;
`;

const Addr = styled(Detail)``;
const PeopleAmount = styled(Detail)``;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
function ListingItem({ listingDocData }: { listingDocData: DocumentData }) {
  const navigate = useNavigate();

  const [isShown, setIsShown] = useState<boolean>(false);

  function clickClose() {
    setIsShown(false);
  }
  function clickFunction() {
    navigate('/signin');
  }
  useEffect(() => {}, [listingDocData]);

  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={'請先進行\n登入註冊進行\n登入註冊'}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      )}
      <CardWrapper>
        <MainImage img={listingDocData?.data().mainImage}></MainImage>
        <InfoWrapper>
          <Title>{listingDocData?.data().title}</Title>
          <DetailWrapper>
            <Addr>
              {listingDocData?.data().countyName}
              {listingDocData?.data().townName}
            </Addr>

            <PeopleAmount>可入住人數:{listingDocData?.data().peopleAmount}</PeopleAmount>
            <Time></Time>
          </DetailWrapper>

          <Rent>
            {listingDocData?.data().startRent}~{listingDocData?.data().endRent}
            /月
          </Rent>
        </InfoWrapper>
      </CardWrapper>
    </Wrapper>
  );
}

export default ListingItem;
