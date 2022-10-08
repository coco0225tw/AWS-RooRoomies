import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { FormGroup, FormLabel, FormInputWrapper, FormControl } from '../../../components/InputArea';
import { RootState } from '../../../redux/rootReducer';
import { BtnDiv, BtnLink } from '../../../components/Button';
import addressType from '../../../redux/UploadAddr/UploadAddrType';
import { uploadAddrAction } from '../../../redux/UploadAddr/UploadAddrAction';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const addressFormGroups = [
  { label: '縣市', key: 'countyname' },
  { label: '鄉鎮市區', key: 'townname' },
  { label: '完整住址 ', key: 'completeAddr' },
  { label: '樓', key: 'floor' },
];
function ListingAddr({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const initialAddrState = getAddr;

  const [addrState, setAddrState] = useState<addressType>(initialAddrState);

  async function submit(addrState: addressType) {
    const chineseAddr = `台灣${addrState.countyname}${addrState.townname}${addrState.completeAddr}`;
    const getGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${chineseAddr}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
    async function getGeocode() {
      await fetch(getGeocodeUrl).then((res) => {
        res.json().then((data) => {
          dispatch({
            type: uploadAddrAction.UPLOAD_ADDR,
            payload: {
              addrState: {
                ...addrState,
                latLng: data.results[0].geometry.location,
              },
            },
          });
        });
      });
    }
    await getGeocode();
  }
  return (
    <Wrapper>
      {addressFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            <FormControl
              defaultValue={addrState[key as keyof typeof addrState] as string}
              onChange={(e) => setAddrState({ ...addrState, [key]: e.target.value })}
            />
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn
        onClick={() => {
          submit(addrState!);
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default ListingAddr;
