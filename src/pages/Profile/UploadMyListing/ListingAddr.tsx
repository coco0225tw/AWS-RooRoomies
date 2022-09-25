import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import addressType from "../../../redux/UploadAddr/UploadAddrType";
import { SubTitle } from "../../../components/ProfileTitle";
import GoogleMapKey from "../../../key";
import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../../components/InputArea";
import { RootState } from "../../../redux/rootReducer";
import { BtnDiv, BtnLink } from "../../../components/Button";
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
  { label: "縣市", key: "countyname" },
  { label: "鄉鎮市區", key: "townname" },
  { label: "完整住址 ", key: "completeAddr" },
  { label: "樓", key: "floor" },
];
function ListingAddr({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const initialAddrState = getAddr;
  // {
  //   countyname: "",
  //   townname: "",
  //   completeAddr: "",
  //   floor: "",
  //   latLng: { lat: null, lng: null },
  // };

  const [addrState, setAddrState] = useState<addressType>(initialAddrState);

  async function submit(addrState: addressType) {
    const chineseAddr = `台灣${addrState.countyname}${addrState.townname}${addrState.completeAddr}`;
    const getGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${chineseAddr}&key=${GoogleMapKey}`;
    async function getGeocode() {
      await fetch(getGeocodeUrl).then((res) => {
        res.json().then((data) => {
          dispatch({
            type: "UPLOAD_ADDR",
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
    console.log("送出地址");
  }
  return (
    <Wrapper>
      {/* <SubTitle>輸入地址</SubTitle> */}
      {addressFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            <FormControl
              defaultValue={addrState[key as keyof typeof addrState] as string}
              onChange={(e) =>
                setAddrState({ ...addrState, [key]: e.target.value })
              }
            />
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn
        onClick={() => {
          submit(addrState!);
          console.log(addrState);
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default ListingAddr;
