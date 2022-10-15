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
  @media screen and (max-width: 1300px) {
    flex-direction: column;
  }
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  background-image: url(${(props) => (props.img ? props.img : '')});
  height: 200px;

  background-position: center;
  background-size: cover;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
  flex-shrink: 1;
  position: absolute;

  @media screen and (max-width: 960px) {
    margin: 0;
    font-weight: 600;
  }
  @media screen and (max-width: 550px) {
    font-size: 16px;
  }
`;
const Detail = styled.div`
  margin-top: 12px;
`;
const Time = styled(Detail)``;

const Rent = styled.div`
  font-size: 28px;
  color: #c77155;
  align-self: flex-end;
  @media screen and (max-width: 1300px) {
    font-size: 20px;
  }
`;

const Addr = styled(Detail)``;
const PeopleAmount = styled(Detail)``;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
  flex-shrink: 1;
  @media screen and (max-width: 1300px) {
    margin-left: 0;
    margin-top: 12px;
  }
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  top: 20%;
  @media screen and (max-width: 1300px) {
    margin-top: 40px;
  }
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
