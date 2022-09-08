import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import titleType from '../../../redux/UploadTitle/UploadTitleType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background-color: lightgrey;
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

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;
function ListingTitle() {
  const dispatch = useDispatch();
  // interface titleType {
  //   title: string;
  //   totalSq: string;
  //   form: string;
  // }

  const initialTitleState = {
    title: '',
    totalSq: '',
    form: '',
  };
  const titleFormGroups = [
    { label: '名稱', key: 'title' },
    { label: '坪數', key: 'totalSq' },
    { label: '規格 ', key: 'form' },
  ];
  const [titleState, setTitleState] = useState<titleType>(initialTitleState);
  function submit(titleState: titleType) {
    console.log('送出');
    console.log(titleState);
    dispatch({ type: 'UPLOAD_TITLE', payload: { titleState } });
  }
  return (
    <Wrapper>
      <h2>輸入基本資訊</h2>
      {titleFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormCheckInput onChange={(e) => setTitleState({ ...titleState, [key]: e.target.value })} />
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit(titleState)}>儲存</SubmitBtn>
      <SubmitBtn>下一頁</SubmitBtn>
    </Wrapper>
  );
}

export default ListingTitle;
