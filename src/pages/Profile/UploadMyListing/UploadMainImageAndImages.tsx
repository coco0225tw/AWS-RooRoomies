import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/rootReducer";
import { previewMainImageAction } from "../../../redux/PreviewMainImage/PreviewMainImageAction";
import { previewOtherImagesAction } from "../../../redux/PreviewOtherImages/PreviewOtherImagesAction";
import { BtnDiv } from "../../../components/Button";
import upload from "../../../assets/upload.png";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const UploadMainImage = styled.input.attrs({
  type: "file",
  accept: "image/*",
})``;
const UploadImages = styled.input.attrs({
  type: "file",
  multiple: true,
})``;
const PreviewArea = styled.div`
  display: flex;
`;
const PreviewMainImage = styled.div<{ src: string }>`
  background-image: url(${(props) => props.src});
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center center;
`;

const PreviewImages = styled(PreviewMainImage)`
  margin-right: 12px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const UploadImgBtn = styled.div`
  transform: translate(20%, 20%);
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
`;
function UploadMainImageAndImages({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  const getMainImage = useSelector(
    (state: RootState) => state.PreviewImageReducer
  );
  const getOtherImages = useSelector(
    (state: RootState) => state.PreviewOtherImagesReducer
  );

  const [mainImgUrl, setMainImgUrl] = useState<string>(getMainImage);
  const [imagesUrl, setImagesUrl] = useState<string[]>(getOtherImages);
  const [imagesBlob, setImagesBlob] = useState<Blob[]>();
  const [mainImgBlob, setMainImgBlob] = useState<Blob>();
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
    dispatch({ type: "UPLOAD_IMAGES", payload: { images } });
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
      <UploadImgBtn
        onClick={() => {
          mainImgRef.current!.click();
        }}
      />
      <UploadMainImage
        hidden
        ref={mainImgRef}
        onChange={(e) => previewMainImage(e)}
      />
      {mainImgUrl && <PreviewMainImage src={mainImgUrl as string} />}
      <UploadImgBtn
        onClick={() => {
          otherImgRef.current!.click();
        }}
      />
      <UploadImages
        hidden
        ref={otherImgRef}
        onChange={(e) => previewImages(e)}
      />
      <PreviewArea>
        {imagesUrl &&
          imagesUrl.map((url, index) => (
            <PreviewImages key={`previewImages${index}`} src={url as string} />
          ))}
      </PreviewArea>
      <SubmitBtn
        onClick={() => {
          uploadAllImages();
          setClickTab("房間規格");
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default UploadMainImageAndImages;
