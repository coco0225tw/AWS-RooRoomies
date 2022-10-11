import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { firebase } from '../../utils/firebase';

import addIcon from '../../assets/add.png';
import unAddIcon from '../../assets/unAdd.png';
import likedIcon from '../../assets/heart.png';
import unLikedIcon from '../../assets/unHeart.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { alertActionType } from '../../redux/Alert/AlertAction';
import { getFavoriteAction } from '../../redux/GetFavoriteListing/GetFavoriteListingAction';

import { PopupComponent } from '../../components/Popup';
interface ImgProps {
  img: string;
}
const Wrapper = styled.div`
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin-bottom: 32px;
  flex-grow: 1;
  transition-duration: 0.2s;
  border-radius: 12px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  @media screen and (max-width: 960px) {
    border: solid 1px lightgrey;
    border-radius: 0;
  }
  @media screen and (max-width: 550px) {
    border: solid 1px lightgrey;
    border-radius: 12px;
  }
`;

const Icon = styled.div`
  aspect-ratio: 1 / 1;
  height: 32px;
  width: 32px;
  background-size: 24px 24px;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 8px;
`;

const IconArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px 0px 0px;
  align-items: start;
  transition-duration: 0.2s;
  position: absolute;
  width: 100%;
  @media screen and (max-width: 960px) {
    padding: 0;
  }
  @media screen and (max-width: 550px) {
    padding: 4px 4px 0px 0px;
  }
`;
const FavoriteIcon = styled(Icon)<{ isLiked: boolean }>`
  background-image: url(${(props) => (props.isLiked ? likedIcon : unLikedIcon)});
  background-color: #fefefe;
`;

const CompareIcon = styled(Icon)<{ isCompared: boolean }>`
  background-image: url(${(props) => (props.isCompared ? addIcon : unAddIcon)});
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #4f5152;
  font-size: 16px;
  @media screen and (max-width: 960px) {
    flex-direction: row;
  }
  @media screen and (max-width: 550px) {
    flex-direction: column;
  }
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  width: 100%;
  background-image: url(${(props) => props.img && props.img});
  background-position: center bottom;
  background-size: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 960px) {
    flex-shrink: 0;
    flex-basis: 30%;
    width: 30%;
    margin-bottom: 0px;
  }
  @media screen and (max-width: 550px) {
    width: 100%;
    margin-bottom: 12px;
  }
`;

const Title = styled.div`
  font-size: 20px;
  color: #4f5152;
  letter-spacing: 2px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  margin: 20px 0px;
  @media screen and (max-width: 960px) {
    margin: 0;
  }
  @media screen and (max-width: 550px) {
    font-size: 16px;
  }
`;

const Time = styled.div``;

const Rent = styled.div`
  font-size: 20px;
  color: #c77155;
  align-self: flex-end;
  @media screen and (max-width: 550px) {
    font-size: 12px;
  }
`;
const InfoArea = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  @media screen and (max-width: 960px) {
    padding: 0 12px;
    width: 70%;
    justify-content: space-between;
  }
  @media screen and (max-width: 550px) {
    width: 100%;
    padding: 0;
    font-size: 12px;
  }
`;
const Addr = styled.div``;
const PeopleAmount = styled.div``;
function Listing({ listingDocData }: { listingDocData: any }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);

  const [isShown, setIsShown] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isLiked: boolean) {
    e.stopPropagation();
    e.preventDefault();

    if (authChange && !submitting) {
      setSubmitting(true);
      if (!isLiked) {
        async function addToFavoriteLists() {
          await firebase.addToFavoriteLists(userInfo.uid, listingDocData.id);
        }
        addToFavoriteLists().then(() => {
          dispatch({
            type: getFavoriteAction.ADD_TO_FAVORITE_LISTS,
            payload: { id: listingDocData.id },
          });
          dispatch({
            type: alertActionType.OPEN_NOTIFY_ALERT,
            payload: {
              alertMessage: '加入喜歡列表',
            },
          });
          setTimeout(() => {
            dispatch({
              type: alertActionType.CLOSE_ALERT,
            });
            setSubmitting(false);
          }, 3000);
        });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, listingDocData.id);
        }
        removeFromFavoriteLists().then(() => {
          dispatch({
            type: getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS,
            payload: { id: listingDocData.id },
          });
          dispatch({
            type: alertActionType.OPEN_NOTIFY_ALERT,
            payload: {
              alertMessage: '從喜歡列表刪除',
            },
          });
          setTimeout(() => {
            dispatch({
              type: alertActionType.CLOSE_ALERT,
            });
            setSubmitting(false);
          }, 3000);
        });
      }
    } else if (!authChange) {
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

  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={`請先進行\n登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      )}
      <CardWrapper>
        <MainImage img={listingDocData.data().mainImage} />

        <InfoArea>
          <Title>{listingDocData.data().title}</Title>
          <Addr>
            {listingDocData.data().countyName}
            {listingDocData.data().townName}
          </Addr>

          <PeopleAmount>可入住人數:{listingDocData.data().peopleAmount}</PeopleAmount>
          <Time></Time>
          <Rent>
            {listingDocData.data().startRent}~{listingDocData.data().endRent}/月
          </Rent>
        </InfoArea>
        <IconArea>
          <FavoriteIcon
            onClick={(e) => {
              handleLiked(e!, favoriteLists.includes(listingDocData.id));
            }}
            isLiked={favoriteLists.includes(listingDocData.id)}
          />
        </IconArea>
      </CardWrapper>
    </Wrapper>
  );
}

export default Listing;
