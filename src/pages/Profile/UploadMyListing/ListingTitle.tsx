import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
function ListingTitle() {
  const dispatch = useDispatch();
  interface addressType {
    title: string;
    totalSq: string;
    form: string;
  }

  const initialAddrState = {
    title: '',
    totalSq: '',
    form: '',
  };
  const [titleState, setTitleState] = useState<addressType>(initialAddrState);
  return (
    <Wrapper>
      <h2>輸入名稱</h2>
      <FormGroup key={`title`}>
        <FormLabel>名稱</FormLabel>
        <FormCheckInput />
      </FormGroup>
      <h2>輸入坪數</h2>
      <FormGroup key={`totalSq`}>
        <FormLabel>坪數</FormLabel>
        <FormCheckInput />
      </FormGroup>
      <h2>輸入規格</h2>
      <FormGroup key={`form`}>
        <FormLabel>規格</FormLabel>
        <FormCheckInput />
      </FormGroup>
    </Wrapper>
  );
}

export default ListingTitle;
