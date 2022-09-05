import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import firebase from '../../utils/firebase';
import UploadMyListing from './UploadMyListing';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  //   flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  //   width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const FormCheckInput = styled.input`
  margin: 0;
  flex-grow: 1;
  height: 19px;
`;

const rentRoomDetailsFormGroups = [
  { label: '月租', key: 'rent' },
  { label: '大小', key: 'sq' },
  { label: '規格', key: 'form' },
  { label: '人數', key: 'peopleAmount' },
];
function RentRoomDetails() {
  return (
    <Wrapper>
      <h1>房間規格</h1>
      {rentRoomDetailsFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormCheckInput type="input" />
        </FormGroup>
      ))}
    </Wrapper>
  );
}

export default RentRoomDetails;
