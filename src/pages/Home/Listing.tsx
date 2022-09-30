import React, { useState, useRef } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import favoriteIcon from "../../assets/icons8-favorite-30.png";
import addIcon from "../../assets/add.png";
import unAddIcon from "../../assets/unAdd.png";
import likedIcon from "../../assets/heart.png";
import unLikedIcon from "../../assets/unHeart.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { Link, useNavigate } from "react-router-dom";
import { PopupComponent } from "../../components/Popup";
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
  margin-bottom: 32px;
  flex-grow: 1;
  transition-duration: 0.2s;
  border-radius: 12px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transform: translate(-1%, -1%);
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
  // flex-grow: 1;
  // &:hover {
  //   width: 32px;
  // }
`;

const IconArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px 0px 0px;
  align-items: start;
  transition-duration: 0.2s;
`;
const FavoriteIcon = styled(Icon)<{ isLiked: boolean }>`
  background-image: url(${(props) =>
    props.isLiked ? likedIcon : unLikedIcon});
  // right: 8px;
  background-color: #fefefe;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
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
  flex-direction: column;
  // border: solid 1px orange;
  align-items: flex-start;
  color: #4f5152;
  font-size: 16px;
`;

const MainImage = styled.div<ImgProps>`
  aspect-ratio: 1 / 1;
  width: 100%;
  background-image: url(${(props) => (props.img ? props.img : "")});
  background-position: center bottom;
  background-size: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.p`
  font-size: 20px;
  color: #4f5152;
  letter-spacing: 2px;
  font-weight: 600;
  // word-break: keep-all;
  // display: table-cell;
  // display: table-cell;
  // text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  // white-space: nowrap;
  // // display: table;
  // overflow: auto;
  // overflow: hidden;
  // margin: 0px 0px 8px 8px;
  // align-self: flex-end;
`;

const Time = styled.div``;

const Rent = styled.div`
  font-size: 20px;
  color: #c77155;
  align-self: flex-end;
`;

const Addr = styled.div``;
const PeopleAmount = styled.div``;
function Listing({ listingDocData }: { listingDocData: any }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteLists = useSelector(
    (state: RootState) => state.GetFavoriteListsReducer
  );
  const compareLists = useSelector(
    (state: RootState) => state.GetCompareListsReducer
  );
  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  function handleLiked(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isLiked: boolean
  ) {
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
            type: "ADD_TO_FAVORITELISTS",
            payload: { id: listingDocData.id },
          });
          dispatch({
            type: "OPEN_NOTIFY_ALERT",
            payload: {
              alertMessage: "加入喜歡列表",
            },
          });
          setTimeout(() => {
            dispatch({
              type: "CLOSE_ALERT",
            });
            setSubmitting(false);
          }, 3000);
        });
      } else {
        async function removeFromFavoriteLists() {
          await firebase.removeFromFavoriteLists(
            userInfo.uid,
            listingDocData.id
          );
        }
        removeFromFavoriteLists().then(() => {
          dispatch({
            type: "REMOVE_FROM_FAVORITELISTS",
            payload: { id: listingDocData.id },
          });
          dispatch({
            type: "OPEN_NOTIFY_ALERT",
            payload: {
              alertMessage: "從喜歡列表刪除",
            },
          });
          setTimeout(() => {
            dispatch({
              type: "CLOSE_ALERT",
            });
            setSubmitting(false);
          }, 3000);
        });
      }
    } else if (!authChange) {
      setIsShown(true);
      console.log("popup");
    }
  }

  function handleCompare(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isCompared: boolean
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (authChange) {
      if (!isCompared) {
        async function addToCompareLists() {
          await firebase.addToCompareLists(userInfo.uid, listingDocData.id);
        }
        addToCompareLists();
        dispatch({
          type: "ADD_TO_COMPARELISTS",
          payload: { id: listingDocData.id },
        });
      } else {
        async function removeFromCompareLists() {
          console.log("removefromcom");
          await firebase.removeFromCompareLists(
            userInfo.uid,
            listingDocData.id
          );
        }
        removeFromCompareLists();
        handleDnd(e, isCompared);
        dispatch({
          type: "REMOVE_FROM_COMPARELISTS",
          payload: { id: listingDocData.id },
        });
      }
    } else {
      setIsShown(true);
      console.log("popup");
    }
  }
  function handleDnd(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isCompared: boolean
  ) {
    e.stopPropagation();
    e.preventDefault();
    if (isCompared) {
      console.log("removefromDnd");
      async function removeFromDndLists() {
        await firebase.removeFromDndLists(userInfo.uid, listingDocData.id);
      }
      removeFromDndLists();
      dispatch({
        type: "REMOVE_FROM_DNDLISTS",
        payload: { id: listingDocData.id },
      });
    }
  }

  function clickClose() {
    setIsShown(false);
  }
  function clickFunction() {
    navigate("/signin");
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
          <IconArea>
            <FavoriteIcon
              onClick={(e) => {
                // if (!submitting) {
                handleLiked(e!, favoriteLists.includes(listingDocData.id));
                // }
              }}
              isLiked={favoriteLists.includes(listingDocData.id)}
            ></FavoriteIcon>
            {/* <CompareIcon
              onClick={(e) => {
                handleCompare(e!, compareLists.includes(listingDocData.id) || dndLists.includes(listingDocData.id));
              }}
              isCompared={compareLists.includes(listingDocData.id) || dndLists.includes(listingDocData.id)}
            ></CompareIcon> */}
          </IconArea>
        </MainImage>
        <Title>{listingDocData.data().title}</Title>
        <Addr>
          {listingDocData.data().countyName}
          {listingDocData.data().townName}
        </Addr>

        <PeopleAmount>
          可入住人數:{listingDocData.data().peopleAmount}
        </PeopleAmount>
        <Time>
          {/* {listingDocData.data().moveInDate.getFullYear() +
            '-' +
            ('0' + (listingDocData.data().moveInDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + listingDocData.data().moveInDate.getDate()).slice(-2)} */}
          {/* {listingDocData.data().uploadedTime?.toDate().toDateString()} */}
        </Time>
        <Rent>
          {listingDocData.data().startRent}~{listingDocData.data().endRent}/月
        </Rent>
      </CardWrapper>
    </Wrapper>
  );
}

export default Listing;
