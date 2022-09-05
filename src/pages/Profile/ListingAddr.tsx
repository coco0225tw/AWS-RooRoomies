import React, { useState, useRef } from 'react';
import '../../utils/Calendar.css';
import styled from 'styled-components';

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

const addressFormGroups = [
  { label: '縣市', key: 'countyname' },
  { label: '鄉鎮市區', key: 'townname' },
  { label: '道路或街名或村里名稱 ', key: 'roadOrStreetNameOrVillage' },
  { label: '路段', key: 'roadSection' },
  { label: '巷', key: 'lane' },
  { label: '弄', key: 'alley' },
  { label: '號', key: 'number' },
  { label: '樓', key: 'floor' },
];
function ListingAddr() {
  return (
    <Wrapper>
      <h2>輸入地址</h2>
      {addressFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormCheckInput />
        </FormGroup>
      ))}
    </Wrapper>
  );
}

export default ListingAddr;
