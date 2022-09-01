import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;
const MainImage = styled.img`
  src: (${(props) => props.src});
  width: 30vw;
`;
function Listing() {
  const { id } = useParams<string>();

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
  const listingRef = doc(db, 'listings', id!);
  type ListingType = {
    mainImage: string;
  };
  const [listingInfo, setListingInfo] = useState<ListingType>();
  useEffect(() => {
    async function getListing() {
      const docSnap = await getDoc(listingRef);
      if (docSnap.exists()) {
        const listingData = docSnap.data() as ListingType;
        setListingInfo(listingData);
      } else {
        console.log('No such document!');
      }
    }
    getListing();
  }, [id]);
  return (
    <Wrapper>
      <div>主要照片</div>
      <MainImage src={listingInfo?.mainImage}></MainImage>
    </Wrapper>
  );
}

export default Listing;
