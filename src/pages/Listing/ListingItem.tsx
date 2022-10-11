import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { RootState } from '../../redux/rootReducer';
import { firebase } from '../../utils/firebase';
import { getFavoriteAction } from '../../redux/GetFavoriteListing/GetFavoriteListingAction';

import { PopupComponent } from '../../components/Popup';

import addIcon from '../assets/add.png';
import unAddIcon from '../assets/unAdd.png';
import likedIcon from '../assets/heart.png';
import unLikedIcon from '../assets/unHeart.png';

interface ImgProps {
  img: string;
}
const Wrapper = styled.div`
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const Icon = styled.div`
  aspect-ratio: 1 / 1;
  height: auto;
  width: 24px;
  background-size: 100% 100%;
  &:hover {
    width: 32px;
  }
`;

const IconArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px 0px 0px;
  align-items: start;
  transition-duration: 0.2s;
`;
const FavoriteIcon = styled(Icon)<{ isLiked: boolean }>`
  background-image: url(${(props) => (props.isLiked ? likedIcon : unLikedIcon)});
  right: 8px;
`;

const CompareIcon = styled(Icon)<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  color: #4f5152;
  font-size: 16px;
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  background-image: url(${(props) => (props.img ? props.img : '')});
  height: 200px;

  background-position: cover;
  background-size: 100% 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 20px;
  color: #4f5152;
  letter-spacing: 2px;
  font-weight: 600;
`;
const Detail = styled.div`
  margin-top: 12px;
`;
const Time = styled(Detail)``;

const Rent = styled.div`
  font-size: 28px;
  color: #c77155;
  align-self: flex-end;
`;

const Addr = styled(Detail)``;
const PeopleAmount = styled(Detail)``;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
function ListingItem({ listingDocData }: { listingDocData: any }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);
  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isLiked: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange) {
      if (!isLiked) {
        async function addToFavoriteLists() {
          await firebase.addToFavoriteLists(userInfo.uid, listingDocData.id);
        }
        addToFavoriteLists();
        dispatch({
          type: getFavoriteAction.ADD_TO_FAVORITE_LISTS,
          payload: { id: listingDocData.id },
        });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, listingDocData.id);
        }
        removeFromFavoriteLists();
        dispatch({
          type: getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS,
          payload: { id: listingDocData.id },
        });
      }
    } else {
      setIsShown(true);
    }
  }

  function handleCompare(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange) {
      if (!isCompared) {
        async function addToCompareLists() {
          await firebase.addToCompareLists(userInfo.uid, listingDocData.id);
        }
        addToCompareLists();
        dispatch({
          type: 'ADD_TO_COMPARELISTS',
          payload: { id: listingDocData.id },
        });
      } else {
        async function removeFromCompareLists() {
          await firebase.removeFromCompareLists(userInfo.uid, listingDocData.id);
        }
        removeFromCompareLists();
        handleDnd(e, isCompared);
        dispatch({
          type: 'REMOVE_FROM_COMPARELISTS',
          payload: { id: listingDocData.id },
        });
      }
    } else {
      setIsShown(true);
    }
  }
  function handleDnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (isCompared) {
      async function removeFromDndLists() {
        await firebase.removeFromDndLists(userInfo.uid, listingDocData.id);
      }
      removeFromDndLists();
      dispatch({
        type: 'REMOVE_FROM_DNDLISTS',
        payload: { id: listingDocData.id },
      });
    }
  }

  function clickClose() {
    setIsShown(false);
  }
  function clickFunction() {
    navigate('/signin');
  }
  useEffect(() => {}, [listingDocData]);

  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={'請先進行\n登入註冊行\n登入註冊'}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      )}
      <CardWrapper>
        <MainImage img={listingDocData?.data().mainImage}>
          {/* <IconArea>
            <FavoriteIcon
              onClick={(e) => handleLiked(e!, favoriteLists.includes(listingDocData.id))}
              isLiked={favoriteLists.includes(listingDocData.id)}
            ></FavoriteIcon>
            <CompareIcon
              onClick={(e) => {
                handleCompare(e!, compareLists.includes(listingDocData.id) || dndLists.includes(listingDocData.id));
              }}
              isCompared={compareLists.includes(listingDocData.id) || dndLists.includes(listingDocData.id)}
            ></CompareIcon>
          </IconArea> */}
        </MainImage>
        <InfoWrapper>
          <Title>{listingDocData?.data().title}</Title>
          <DetailWrapper>
            <Addr>
              {listingDocData?.data().countyName}
              {listingDocData?.data().townName}
            </Addr>

            <PeopleAmount>可入住人數:{listingDocData?.data().peopleAmount}</PeopleAmount>
            <Time></Time>
          </DetailWrapper>

          <Rent>
            {listingDocData?.data().startRent}~{listingDocData?.data().endRent}
            /月
          </Rent>
        </InfoWrapper>
      </CardWrapper>
    </Wrapper>
  );
}

export default ListingItem;
