import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import titleType from '../../../redux/UploadTitle/UploadTitleType';
import { SubTitle } from '../../../components/ProfileTitle';
import { RootState } from '../../../redux/rootReducer';
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../../components/InputArea';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  // background-color: lightgrey;
`;

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  &:hover {
    background-color: #222;
  }
`;
function ListingTitle() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const titleInfo = useSelector((state: RootState) => state.UploadTitleReducer);
  const initialTitleState =
    userInfo!.userListingId?.length !== 0
      ? titleInfo
      : {
          title: '',
          totalSq: '',
          form: '',
        };
  console.log(initialTitleState);
  const titleFormGroups = [
    { label: '名稱', key: 'title' },
    { label: '坪數', key: 'totalSq' },
    { label: '規格 ', key: 'form' },
  ];
  const [titleState, setTitleState] = useState<titleType>(initialTitleState);
  function submit(titleState: titleType) {
    dispatch({ type: 'UPLOAD_TITLE', payload: { titleState } });
    console.log('送出基本資料');
  }
  return (
    <Wrapper>
      <SubTitle>輸入基本資訊</SubTitle>
      {titleFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            <FormControl
              value={titleState[key as keyof titleType]}
              onChange={(e) => setTitleState({ ...titleState, [key]: e.target.value })}
            />
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit(titleState)}>儲存</SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default ListingTitle;
