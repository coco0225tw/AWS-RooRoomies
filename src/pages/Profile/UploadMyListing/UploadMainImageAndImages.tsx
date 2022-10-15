import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../redux/rootReducer';
import { previewMainImageAction } from '../../../redux/PreviewMainImage/PreviewMainImageAction';
import { previewOtherImagesAction } from '../../../redux/PreviewOtherImages/PreviewOtherImagesAction';
import { uploadImagesAction } from '../../../redux/UploadMainImageAndImages/UploadMainImageAndImagesAction';

import { BtnDiv, BtnArea, LastPageBtn } from '../../../components/Button';
import { alertActionType } from '../../../redux/Alert/AlertAction';

import upload from '../../../assets/upload.png';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const UploadMainImage = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})``;
const UploadImages = styled.input.attrs({
  type: 'file',
  multiple: true,
})``;
const PreviewArea = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 12px;
`;
const PreviewMainImage = styled.div<{ src: string }>`
  background-image: url(${(props) => props.src});
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center center;
  border: ${(props) => (props.src ? 'none' : 'dotted 3px #c77155')};
  color: #c77155;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImages = styled(PreviewMainImage)``;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const UploadImgBtn = styled.div`
  border: none;
  font-size: 12px;
  background: #c77155;
  color: whitesmoke;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  margin-bottom: 20px;
  background-size: cover;
  background-image: url(${upload});
  background-size: 40px 40px;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  left: 100%;
  transform: translate(-100%, -100%);
`;
const UploadArea = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;
function UploadMainImageAndImages({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const getMainImage = useSelector((state: RootState) => state.PreviewImageReducer);
  const getOtherImages = useSelector((state: RootState) => state.PreviewOtherImagesReducer);
  const imageBlob = useSelector((state: RootState) => state.UploadImagesReducer);

  const [mainImgUrl, setMainImgUrl] = useState<string>(getMainImage);
  const [imagesUrl, setImagesUrl] = useState<string[]>(getOtherImages);
  const [imagesBlob, setImagesBlob] = useState<Blob[]>(imageBlob.images);
  const [mainImgBlob, setMainImgBlob] = useState<Blob>(imageBlob.mainImage);
  const mainImgRef = useRef<HTMLInputElement>(null);
  const otherImgRef = useRef<HTMLInputElement>(null);

  function previewMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    if ((files as FileList)[0]) {
      setMainImgUrl(URL.createObjectURL((files as FileList)[0]));
      setMainImgBlob((files as FileList)[0]);
    }
  }

  function previewImages(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    function loopImages(files: FileList) {
      const fl = files.length;
      let arr = [];
      let blobArr = [];
      for (let i = 0; i < fl; i++) {
        let file = files[i];
        arr.push(URL.createObjectURL(file));
        blobArr.push(file);
      }
      setImagesUrl(arr);
      setImagesBlob(blobArr);
    }
    loopImages(files!);
  }
  async function uploadAllImages() {
    let images = { mainImage: mainImgBlob, images: imagesBlob };
    dispatch({ type: uploadImagesAction.UPLOAD_IMAGES, payload: { images } });
    dispatch({
      type: previewMainImageAction.PREVIEW_MAIN_IMAGE,
      payload: { mainImage: mainImgUrl },
    });
    dispatch({
      type: previewOtherImagesAction.PREVIEW_OTHER_IMAGES,
      payload: { otherImages: imagesUrl },
    });
  }
  return (
    <Wrapper>
      <UploadArea>
        <PreviewMainImage src={mainImgUrl as string}>
          {!mainImgUrl && <React.Fragment>上傳封面照</React.Fragment>}
        </PreviewMainImage>

        <UploadMainImage hidden ref={mainImgRef} onChange={(e) => previewMainImage(e)} />
        <UploadImgBtn
          onClick={() => {
            mainImgRef.current!.click();
          }}
        />
      </UploadArea>
      <UploadArea>
        {imagesUrl.length === 0 && (
          <PreviewMainImage src={null}>
            {imagesUrl.length === 0 && (
              <React.Fragment>
                其他照片
                <br />
                (4-10張)
              </React.Fragment>
            )}
          </PreviewMainImage>
        )}

        <PreviewArea>
          {imagesUrl.length !== 0 &&
            imagesUrl.map((url, index) => <PreviewImages key={`previewImages${index}`} src={url as string} />)}
        </PreviewArea>
        <UploadImgBtn
          onClick={() => {
            otherImgRef.current!.click();
          }}
        />
        <UploadImages hidden ref={otherImgRef} onChange={(e) => previewImages(e)} />
      </UploadArea>
      <BtnArea>
        <LastPageBtn
          onClick={() => {
            setClickTab('地址');
          }}
        >
          上一頁
        </LastPageBtn>
        <SubmitBtn
          onClick={() => {
            uploadAllImages();
            if (!mainImgBlob || imagesBlob.length < 4 || imagesBlob.length > 10) {
              dispatch({
                type: alertActionType.OPEN_ERROR_ALERT,
                payload: {
                  alertMessage: '請上傳正確照片數',
                },
              });
              setTimeout(() => {
                dispatch({
                  type: alertActionType.CLOSE_ALERT,
                });
              }, 3000);
            } else {
              setClickTab('房間規格');
            }
          }}
        >
          儲存
        </SubmitBtn>
      </BtnArea>
    </Wrapper>
  );
}

export default UploadMainImageAndImages;
