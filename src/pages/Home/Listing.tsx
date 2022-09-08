import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData } from 'firebase/firestore';
interface ImgProps {
  img: string;
}
const Wrapper = styled.div`
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  // margin: auto;
  padding: 10px;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: solid 1px orange;
  align-items: flex-start;
`;

const MainImage = styled.div<ImgProps>`
  width: 100%;
  height: 300px;
  background-image: url(${(props) => (props.img ? props.img : '')});
  background-size: cover;
`;

const Title = styled.h3`
  margin: 0;
`;

const Time = styled.div``;

const Rent = styled.div``;

const Addr = styled.div``;
function Listing(data: DocumentData) {
  return (
    <Wrapper>
      <CardWrapper>
        <MainImage img={data?.data.mainImage}>這裡是圖片</MainImage>
        <Title>{data?.data.title}</Title>
        <Rent>
          {data?.data.startRent}~{data?.data.endRent}/月
        </Rent>
        <Addr>
          縣市:{data?.data.countyName}
          地區:{data?.data.townName}
        </Addr>
        <Time>{data?.data?.uploadedTime?.toDate().toDateString()}</Time>
      </CardWrapper>
    </Wrapper>
  );
}

export default Listing;
