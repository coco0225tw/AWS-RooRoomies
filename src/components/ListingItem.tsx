import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../utils/firebase';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import favoriteIcon from '../../assets/icons8-favorite-30.png';
import addIcon from '../assets/add.png';
import unAddIcon from '../assets/unAdd.png';
import likedIcon from '../assets/heart.png';
import unLikedIcon from '../assets/unHeart.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { Link, useNavigate } from 'react-router-dom';
import { PopupComponent } from './Popup';
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
  //   padding: 10px;
  //   margin-bottom: 32px;
`;

const Icon = styled.div`
  aspect-ratio: 1 / 1;
  height: auto;
  width: 24px;
  background-size: 100% 100%;
  // flex-grow: 1;
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
  // border: solid 1px orange;
  //   align-items: flex-start;
  //   background-color: black;
  width: 100%;
  color: #4f5152;
  font-size: 16px;
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  //   width: 100%;
  background-image: url(${(props) => (props.img ? props.img : '')});
  height: 200px;

  background-position: cover;
  background-size: 100% 100%;
  border-radius: 12px;
  //   margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 20px;
  color: #4f5152;
  letter-spacing: 2px;
  font-weight: 600;
  // margin: 0px 0px 8px 8px;
  // align-self: flex-end;
`;
const Detail = styled.div`
  margin-top: 12px;
`;
const Time = styled(Detail)``;

const Rent = styled.div`
  font-size: 28px;
  color: #c77155;
  align-self: flex-end;
  //   bottom: 0;
  //   flex-grow: 1;
  //   vertical-align: text-bottom;
`;

const Addr = styled(Detail)``;
const PeopleAmount = styled(Detail)``;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
  //   flex-grow: 1;
  //   height: 100%;
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
function ListingItem({ listingDocData }: { listingDocData: any }) {
  console.log(listingDocData);
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
        dispatch({ type: 'ADD_TO_FAVORITELISTS', payload: { id: listingDocData.id } });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(userInfo.uid, listingDocData.id);
        }
        removeFromFavoriteLists();
        dispatch({ type: 'REMOVE_FROM_FAVORITELISTS', payload: { id: listingDocData.id } });
      }
    } else {
      setIsShown(true);
      console.log('popup');
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
        dispatch({ type: 'ADD_TO_COMPARELISTS', payload: { id: listingDocData.id } });
      } else {
        async function removeFromCompareLists() {
          console.log('removefromcom');
          await firebase.removeFromCompareLists(userInfo.uid, listingDocData.id);
        }
        removeFromCompareLists();
        handleDnd(e, isCompared);
        dispatch({ type: 'REMOVE_FROM_COMPARELISTS', payload: { id: listingDocData.id } });
      }
    } else {
      setIsShown(true);
      console.log('popup');
    }
  }
  function handleDnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>, isCompared: boolean) {
    e.stopPropagation();
    e.preventDefault();
    if (isCompared) {
      console.log('removefromDnd');
      async function removeFromDndLists() {
        await firebase.removeFromDndLists(userInfo.uid, listingDocData.id);
      }
      removeFromDndLists();
      dispatch({ type: 'REMOVE_FROM_DNDLISTS', payload: { id: listingDocData.id } });
    }
  }

  function clickClose() {
    setIsShown(false);
  }
  function clickFunction() {
    navigate('/signin');
  }
  // console.log(new Date(listingDocData.data().moveInDate));
  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          // style={{ zIndex: '1' }}
          msg={`請先進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      )}
      <CardWrapper>
        <MainImage img={listingDocData.data().mainImage}>
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
          <Title>{listingDocData.data().title}</Title>
          <DetailWrapper>
            <Addr>
              {listingDocData.data().countyName}
              {listingDocData.data().townName}
            </Addr>

            <PeopleAmount>可入住人數:{listingDocData.data().peopleAmount}</PeopleAmount>
            <Time></Time>
          </DetailWrapper>

          <Rent>
            {listingDocData.data().startRent}~{listingDocData.data().endRent}/月
          </Rent>
        </InfoWrapper>
      </CardWrapper>
    </Wrapper>
  );
}

export default ListingItem;
