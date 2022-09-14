import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import favoriteIcon from '../../assets/icons8-favorite-30.png';
import addIcon from '../../assets/add.png';
import unAddIcon from '../../assets/unAdd.png';
import likedIcon from '../../assets/heart.png';
import unLikedIcon from '../../assets/unHeart.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
interface ImgProps {
  img: string;
}
const Wrapper = styled.div`
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  // margin: auto;
  padding: 10px;
`;

const FavoriteIcon = styled.div<{ isLiked: boolean }>`
  background-image: url(${(props) => (props.isLiked ? likedIcon : unLikedIcon)});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;

const CompareIcon = styled.div<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: solid 1px orange;
  align-items: flex-start;
`;

const MainImage = styled.div<ImgProps>`
  width: 100%;
  height: 300px;
  background-image: url(${(props) => (props.img ? props.img : '')});
  background-size: cover;
`;

const Title = styled.h3`
  margin: 0;
`;

const Time = styled.div``;

const Rent = styled.div``;

const Addr = styled.div``;
const PeopleAmount = styled.div``;
function Listing({ listingDocData }: { listingDocData: any }) {
  const dispatch = useDispatch();
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isLiked: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (!isLiked) {
      async function addToFavoriteLists() {
        await firebase.addToFavoriteLists(userInfo.uid, listingDocData.id);
      }
      addToFavoriteLists();
      dispatch({ type: 'ADD_TO_FAVORITELISTS', payload: { id: listingDocData.id } });
    } else {
      async function removeFromFavoriteLists() {
        await firebase.removeFromFavoriteLists(userInfo.uid, listingDocData.id);
      }
      removeFromFavoriteLists();
      dispatch({ type: 'REMOVE_FROM_FAVORITELISTS', payload: { id: listingDocData.id } });
    }
  }

  function handleCompare(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (!isCompared) {
      async function addToCompareLists() {
        await firebase.addToCompareLists(userInfo.uid, listingDocData.id);
      }
      addToCompareLists();
      dispatch({ type: 'ADD_TO_COMPARELIST', payload: { id: listingDocData.id } });
    } else {
      async function removeFromCompareLists() {
        await firebase.removeFromCompareLists(userInfo.uid, listingDocData.id);
      }
      removeFromCompareLists();
      dispatch({ type: 'REMOVE_FROM_COMPARELIST', payload: { id: listingDocData.id } });
    }
  }
  return (
    <Wrapper>
      <CardWrapper>
        <MainImage img={listingDocData.data().mainImage}>
          <FavoriteIcon
            onClick={(e) => handleLiked(e!, favoriteLists.includes(listingDocData.id))}
            isLiked={favoriteLists.includes(listingDocData.id)}
          ></FavoriteIcon>
          <CompareIcon
            onClick={(e) => handleCompare(e!, compareLists.includes(listingDocData.id))}
            isCompared={compareLists.includes(listingDocData.id)}
          ></CompareIcon>
        </MainImage>
        <Title>{listingDocData.data().title}</Title>
        <Rent>
          {listingDocData.data().startRent}~{listingDocData.data().endRent}/月
        </Rent>
        <Addr>
          縣市:{listingDocData.data().countyName}
          地區:{listingDocData.data().townName}
        </Addr>
        <PeopleAmount>人數:{listingDocData.data().peopleAmount}</PeopleAmount>
        <Time>{listingDocData.data().uploadedTime?.toDate().toDateString()}</Time>
      </CardWrapper>
    </Wrapper>
  );
}

export default Listing;
