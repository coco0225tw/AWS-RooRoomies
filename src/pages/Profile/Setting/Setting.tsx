import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import Hr from "../../../components/Hr";
import { BtnDiv } from "../../../components/Button";
import { Title } from "../../../components/ProfileTitle";
import { firebase } from "../../../utils/firebase";
import { Loading } from "../../../components/Loading";
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
import upload from "../../../assets/upload.png";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
const SubmitBtn = styled(BtnDiv)`
  border: solid 1px #4f5152;
  align-self: flex-end;
  margin-top: 20px;
`;
const ProfilePic = styled.div<{ img: string; uploadedImg: string }>`
  width: 200px;
  height: 200px;
  background-image: url(${(props) =>
    props.uploadedImg !== "" ? props.uploadedImg : props.img});
  background-size: cover;
  background-position: center center;
  border-radius: 50%;
  border: solid 12px #ece2d5;
`;

const UploadImgBtn = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(20%, 20%);
  border: none;
  // font-size: 20px;
  background: #c77155;
  color: whitesmoke;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  background-size: 40px 40px;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url(${upload});
`;
function Setting({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [mainImgUrl, setMainImgUrl] = useState<string>("");
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const [edit, setEdit] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const picRef = useRef<HTMLInputElement>(null);
  const [mainImgBlob, setMainImgBlob] = useState<Blob>();
  function previewMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    if ((files as FileList)[0]) {
      setMainImgUrl(URL.createObjectURL((files as FileList)[0]));
      setMainImgBlob((files as FileList)[0]);
    }
  }
  async function submitNameOrEmail() {
    firebase.updateUserInfo(
      userInfo.uid,
      nameRef.current!.value,
      emailRef.current!.value
    );
  }
  async function submitImg() {
    firebase.updateUserPic(userInfo.uid, mainImgBlob!);
  }
  return (
    <Wrapper>
      <Title>設定</Title>
      <Hr />
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <FormGroup>
            <ProfilePic img={userInfo!.image} uploadedImg={mainImgUrl}>
              <UploadImgBtn
                onClick={() => {
                  picRef.current!.click();
                }}
              ></UploadImgBtn>
            </ProfilePic>
            <FormControl
              onChange={(e) => previewMainImage(e)}
              ref={picRef}
              type="file"
              hidden
            ></FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>名字</FormLabel>
            <FormControl
              ref={nameRef}
              defaultValue={userInfo!.name}
            ></FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>信箱</FormLabel>
            <FormControl
              ref={emailRef}
              defaultValue={userInfo!.email}
            ></FormControl>
          </FormGroup>

          <SubmitBtn
            onClick={() => {
              if (mainImgUrl !== "") {
                submitImg();
              }
              submitNameOrEmail();
            }}
          >
            儲存變更
          </SubmitBtn>
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default Setting;
