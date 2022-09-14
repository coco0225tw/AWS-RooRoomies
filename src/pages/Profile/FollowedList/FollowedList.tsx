import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { firebase } from '../../../utils/firebase';
import likedIcon from '../../../assets/heart.png';
import unLikedIcon from '../../../assets/unHeart.png';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
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
  const dispatch = useDispatch();
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  console.log(favoriteLists);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    async function removeFromFavoriteLists() {
      await firebase.removeFromFavoriteLists(userInfo.uid, listingId);
    }
    removeFromFavoriteLists();
    dispatch({ type: 'REMOVE_FROM_FAVORITELISTS', payload: { id: listingId } });
  }
  return (
    <Wrapper>
      <div>追蹤物件</div>
      {favoriteLists &&
        favoriteLists.map((f, index) => (
          <div key={`favoriteLists${index}`}>
            <div>{f}</div>
            <FavoriteIcon onClick={(e) => handleLiked(e, f)}></FavoriteIcon>
          </div>
        ))}
    </Wrapper>
  );
}

export default FollowedList;
