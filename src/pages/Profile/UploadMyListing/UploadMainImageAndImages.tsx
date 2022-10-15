import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../redux/rootReducer';
import { previewMainImageAction } from '../../../redux/PreviewMainImage/PreviewMainImageAction';
import { previewOtherImagesAction } from '../../../redux/PreviewOtherImages/PreviewOtherImagesAction';
import { uploadImagesAction } from '../../../redux/UploadMainImageAndImages/UploadMainImageAndImagesAction';
import { PopupImage, PopupImageDelete } from '../../../components/Popup';

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
  cursor: pointer;
  border-radius: 8px;
  transition-duration: 0.2s;
  :hover {
    transform: scale(1.1);
  }
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
  const [popImg, setPopImg] = useState<boolean>(false);
  const [clickImgUrl, setClickImgUrl] = useState<string | null>(null);
  const mainImgRef = useRef<HTMLInputElement>(null);
  const otherImgRef = useRef<HTMLInputElement>(null);

  function previewMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    if ((files as FileList)[0]) {
      dispatch({
        type: previewMainImageAction.PREVIEW_MAIN_IMAGE,
        payload: { mainImage: URL.createObjectURL((files as FileList)[0]) },
      });

      dispatch({
        type: uploadImagesAction.UPLOAD_MAIN_IMAGE,
        payload: { mainImage: (files as FileList)[0] },
      });
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
      dispatch({
        type: previewOtherImagesAction.PREVIEW_OTHER_IMAGES,
        payload: { otherImages: arr },
      });
      dispatch({
        type: uploadImagesAction.UPLOAD_IMAGES,
        payload: { images: blobArr },
      });
    }
    loopImages(files!);
  }
  function deletePhoto() {
    if (clickImgUrl === getMainImage) {
      dispatch({ type: previewMainImageAction.RETURN_INITIAL_IMAGE });
      dispatch({ type: uploadImagesAction.DELETE_MAIN_IMAGE });
    } else {
      dispatch({ type: previewOtherImagesAction.DELETE_OTHER_IMAGE, payload: { url: clickImgUrl } });
      let index = getOtherImages.findIndex((u) => u === clickImgUrl);

      dispatch({ type: uploadImagesAction.DELETE_OTHER_IMAGE, payload: { index: index } });
    }
  }
  return (
    <Wrapper>
      {popImg && (
        <PopupImageDelete
          img={clickImgUrl as string}
          clickClose={() => {
            setClickImgUrl(null);
            setPopImg(false);
          }}
          deleteFn={() => {
            deletePhoto();
          }}
        />
      )}
      <UploadArea>
        <PreviewMainImage
          src={getMainImage as string}
          onClick={() => {
            if (getMainImage) {
              setClickImgUrl(getMainImage);
              setPopImg(true);
            }
          }}
        >
          {!getMainImage && <React.Fragment>上傳封面照</React.Fragment>}
        </PreviewMainImage>

        <UploadMainImage hidden ref={mainImgRef} onChange={(e) => previewMainImage(e)} />
        <UploadImgBtn
          onClick={() => {
            mainImgRef.current!.click();
          }}
        />
      </UploadArea>
      <UploadArea>
        {getOtherImages.length === 0 && (
          <PreviewMainImage src={null}>
            {getOtherImages.length === 0 && (
              <React.Fragment>
                其他照片
                <br />
                (4-10張)
              </React.Fragment>
            )}
          </PreviewMainImage>
        )}

        <PreviewArea>
          {getOtherImages.length !== 0 &&
            getOtherImages.map((url, index) => (
              <PreviewImages
                onClick={() => {
                  setClickImgUrl(url);
                  setPopImg(true);
                }}
                key={`previewImages${index}`}
                src={url as string}
              />
            ))}
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
            // uploadAllImages();

            if (!imageBlob.mainImage || imageBlob.images.length < 4 || imageBlob.images.length > 10) {
              dispatch({
                type: alertActionType.OPEN_ERROR_ALERT,
                payload: {
                  alertMessage: '請上傳一張封面及4~10張其他照片',
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
