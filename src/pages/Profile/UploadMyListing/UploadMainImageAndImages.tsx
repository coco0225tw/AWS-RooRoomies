import React, { useState, useRef } from 'react';
import '../../utils/Calendar.css';
import styled from 'styled-components';
import firebase from '../../../utils/firebase';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const Title = styled.div``;

const UploadMainImage = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})``;
const UploadImages = styled.input.attrs({
  type: 'file',
  multiple: true,
})``;
const PreviewMainImage = styled.img`
  src: (${(props) => props.src});
  width: 30vw;
`;

const PreviewImages = styled(PreviewMainImage)``;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
`;

function UploadMainImageAndImages() {
  const [mainImgUrl, setMainImgUrl] = useState<string>();
  const [imagesUrl, setImagesUrl] = useState<string[]>();
  const [imagesBlob, setImagesBlob] = useState<Blob[]>();
  const [mainImgBlob, setMainImgBlob] = useState<Blob>();
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
    Promise.all([firebase.uploadMainImage(mainImgBlob!), firebase.uploadImages(imagesBlob as [])]).then(() =>
      console.log('successfully Uploaded')
    );
  }

  return (
    <Wrapper>
      <h2>上傳圖片</h2>
      <UploadMainImage onChange={(e) => previewMainImage(e)} />
      {mainImgUrl && <PreviewMainImage src={mainImgUrl as string} />}
      <UploadImages onChange={(e) => previewImages(e)} />
      {imagesUrl && imagesUrl.map((url, index) => <PreviewImages key={`previewImages${index}`} src={url as string} />)}
      <SubmitBtn onClick={uploadAllImages}>送出</SubmitBtn>
    </Wrapper>
  );
}

export default UploadMainImageAndImages;
