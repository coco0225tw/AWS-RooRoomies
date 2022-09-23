import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { firebase } from '../../../utils/firebase';
import likedIcon from '../../../assets/heart.png';
import unLikedIcon from '../../../assets/unHeart.png';
import Hr from '../../../components/Hr';
import { BtnDiv } from '../../../components/Button';
import { Title } from '../../../components/ProfileTitle';
import Listing from '../../Home/Listing';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../../components/InputArea';
import { async } from '@firebase/util';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 70%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
const FavoriteIcon = styled.div`
  background-image: url(${likedIcon});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;
function FollowedList() {
  async function getListing(listingId: string) {
    let data = firebase.getListing(listingId);
    return data;
  }
  const dispatch = useDispatch();
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const [allListingData, setAllListingData] = useState<DocumentData[]>([]);
  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    async function removeFromFavoriteLists() {
      await firebase.removeFromFavoriteLists(userInfo.uid, listingId);
    }
    removeFromFavoriteLists();
    dispatch({ type: 'REMOVE_FROM_FAVORITELISTS', payload: { id: listingId } });
  }
  useEffect(() => {
    async function getAllListing() {
      // getListing;
      let promise: DocumentData[] = [];
      favoriteLists.map((id, index) => {
        promise.push(firebase.getFavoriteListing(id) as DocumentData);
      });
      let allPromises = await Promise.all(promise);
      let listingDocArr: DocumentData[] = [];
      // allPromises.then((listing) => {
      allPromises.forEach((doc) => {
        listingDocArr.push(doc);
        console.log(doc);
      });
      // });

      setAllListingData(listingDocArr);
      console.log(listingDocArr);
    }
    getAllListing();
  }, []);
  return (
    <Wrapper>
      <Title>追蹤物件</Title>
      <Hr />
      {favoriteLists &&
        allListingData.map((f, index) => (
          <div key={`favoriteLists${index}`}>
            <Listing listingDocData={f}></Listing>
            <FavoriteIcon onClick={(e) => handleLiked(e, f.id)}></FavoriteIcon>
          </div>
        ))}
    </Wrapper>
  );
}

export default FollowedList;
