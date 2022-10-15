import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { alertActionType } from '../../../redux/Alert/AlertAction';
import { getAuthAction } from '../../../redux/GetAuth/GetAuthAction';

import { RootState } from '../../../redux/rootReducer';
import { FormGroup, FormLabel, FormControl } from '../../../components/InputArea';
import { BtnDiv } from '../../../components/Button';
import { Title } from '../../../components/ProfileTitle';
import { firebase } from '../../../utils/firebase';
import { Loading } from '../../../components/Loading';
import Hr from '../../../components/Hr';

import upload from '../../../assets/upload.png';
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

const SubmitBtn = styled(BtnDiv)`
  align-self: flex-end;
  margin-top: 20px;
`;
const ProfilePic = styled.div<{ img: string; uploadedImg: string }>`
  width: 200px;
  height: 200px;
  background-image: url(${(props) => (props.uploadedImg !== '' ? props.uploadedImg : props.img)});
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
const BtnWrapper = styled.div`
  display: flex;
  align-self: flex-end;
`;
function Setting({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);

  const [mainImgUrl, setMainImgUrl] = useState<string>(userInfo.image);
  const [edit, setEdit] = useState<boolean>(false);
  const [mainImgBlob, setMainImgBlob] = useState<Blob>();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const picRef = useRef<HTMLInputElement>(null);

  function previewMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    if ((files as FileList)[0]) {
      setMainImgUrl(URL.createObjectURL((files as FileList)[0]));
      setMainImgBlob((files as FileList)[0]);
    }
  }
  async function submitNameOrEmail() {
    firebase
      .updateUserInfo(userInfo.uid, nameRef.current!.value)
      .then(() => {
        dispatch({
          type: getAuthAction.UPLOAD_USER_IMAGE,
          payload: {
            image: mainImgUrl,
          },
        });
        dispatch({
          type: alertActionType.OPEN_SUCCESS_ALERT,
          payload: {
            alertMessage: '更新使用者資料成功',
          },
        });
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
        }, 3000);
      })
      .catch(() => {
        dispatch({
          type: alertActionType.OPEN_ERROR_ALERT,
          payload: {
            alertMessage: '更新使用者資料失敗',
          },
        });
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
        }, 3000);
      });
  }
  async function submitImg() {
    firebase.updateUserPic(userInfo.uid, mainImgBlob!);
  }
  return (
    <Wrapper>
      <Title>設定</Title>
      <Hr />
      {loading ? (
        <Loading style={null} />
      ) : (
        <React.Fragment>
          <FormGroup>
            <ProfilePic img={userInfo!.image} uploadedImg={mainImgUrl}>
              <UploadImgBtn
                onClick={() => {
                  picRef.current!.click();
                }}
              />
            </ProfilePic>
            <FormControl onChange={(e) => previewMainImage(e)} ref={picRef} type="file" hidden disabled={!edit} />
          </FormGroup>
          <FormGroup>
            <FormLabel>名字</FormLabel>
            <FormControl ref={nameRef} defaultValue={userInfo!.name} disabled={!edit} />
          </FormGroup>
          {edit ? (
            <BtnWrapper>
              <SubmitBtn
                onClick={() => {
                  setEdit(false);
                  setMainImgUrl('');
                  nameRef.current.value = userInfo!.name;
                }}
              >
                取消
              </SubmitBtn>
              <SubmitBtn
                style={{ marginLeft: '12px' }}
                onClick={() => {
                  setEdit(false);
                  if (mainImgUrl !== '') {
                    submitImg();
                  }
                  submitNameOrEmail();
                }}
              >
                儲存變更
              </SubmitBtn>
            </BtnWrapper>
          ) : (
            <SubmitBtn
              onClick={() => {
                setEdit(true);
              }}
            >
              編輯
            </SubmitBtn>
          )}
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default Setting;
