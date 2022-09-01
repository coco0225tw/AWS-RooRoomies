import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const UploadImage = styled.input.attrs({
  type: 'file',
  multiple: true,
})``;
const PreviewMainImage = styled.img`
  src: (${(props) => props.src});
  width: 30vw;
`;

const SubmitBtn = styled.div`
  padding: 10px;
`;
function Profile() {
  const firebaseConfig = {
    apiKey: 'AIzaSyDxZxLUfOcXF0TTHQr7QJlOmtFNUhH_w2Q',
    authDomain: 'rooroomies.firebaseapp.com',
    projectId: 'rooroomies',
    storageBucket: 'rooroomies.appspot.com',
    messagingSenderId: '902090494840',
    appId: '1:902090494840:web:b89eee21700f2fb39e2e8d',
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const storageRef = ref(storage);
  const listingId = 'Gxj1G1AFiPZFRzW3gkOq';
  const listingRef = doc(db, 'listings', listingId);
  const imagesRef = ref(storage, `${listingId}/mainImage`);
  const [mainImgUrl, setMainImgUrl] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string[]>();
  const [mainImgBlob, setMainImgBlob] = useState<Blob>();

  function previewMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target as HTMLInputElement;
    let files = target.files;
    if ((files as FileList)[0]) {
      setMainImgUrl(URL.createObjectURL((files as FileList)[0]));
      setMainImgBlob((files as FileList)[0]);
    }
  }

  //   function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
  //     let target = e.target as HTMLInputElement;
  //     let files = target.files;
  //     if ((files as FileList)[0]) {
  //       setMainImgUrl(URL.createObjectURL((files as FileList)[0]));
  //       setMainImgBlob((files as FileList)[0]);
  //     }
  //   }
  async function uploadMainImage() {
    await uploadBytes(imagesRef, mainImgBlob!).then(() => {
      console.log('Uploaded a blob or file!');
    });
    await getDownloadURL(imagesRef).then(async (url) => {
      await updateDoc(listingRef, {
        mainImage: url,
      });
    });
  }
  return (
    <Wrapper>
      <Title>上傳圖片</Title>
      <UploadMainImage onChange={(e) => previewMainImage(e)} />
      <PreviewMainImage src={mainImgUrl as string} />
      <UploadImage />
      <SubmitBtn onClick={uploadMainImage}>送出</SubmitBtn>
    </Wrapper>
  );
}

export default Profile;
