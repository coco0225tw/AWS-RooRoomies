import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import { firebase } from "../../../utils/firebase";
import likedIcon from "../../../assets/heart.png";
import unLikedIcon from "../../../assets/unHeart.png";
import Hr from "../../../components/Hr";
import { BtnDiv } from "../../../components/Button";
import { Title } from "../../../components/ProfileTitle";
import ListingItem from "../../../components/ListingItem";
import { Loading } from "../../../components/Loading";

import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { PopupComponent, PopupImage } from "../../../components/Popup";
import { Link } from "react-router-dom";
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../../components/InputArea";
import { async } from "@firebase/util";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
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
  position: absolute;
  right: 20px;
`;
const ListingWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  border: solid 1px #f3f2ef;
  width: 100%;
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 12px;
`;
function FollowedList({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  async function getListing(listingId: string) {
    let data = firebase.getListing(listingId);
    return data;
  }
  const dispatch = useDispatch();
  const favoriteLists = useSelector(
    (state: RootState) => state.GetFavoriteListsReducer
  );
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const [allListingData, setAllListingData] = useState<DocumentData[]>([]);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [unLikeId, setUnLikeId] = useState<string>("");
  function handleLiked(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    listingId: string
  ) {
    e.stopPropagation();
    e.preventDefault();
    setIsShown(true);
    setUnLikeId(listingId);
  }
  async function removeFromFavoriteLists() {
    firebase.removeFromFavoriteLists(userInfo.uid, unLikeId).then(() => {
      dispatch({
        type: "REMOVE_FROM_FAVORITELISTS",
        payload: { id: unLikeId },
      });
      dispatch({
        type: "OPEN_ALERT",
        payload: {
          alert: {
            alertType: "提示",
            alertMessage: "從喜歡列表刪除",
            isAlert: true,
          },
        },
      });
      setTimeout(() => {
        dispatch({
          type: "CLOSE_ALERT",
        });
      }, 3000);
      setAllListingData(allListingData.filter((el, i) => el.id !== unLikeId));
      setIsShown(false);
    });
  }

  useEffect(() => {
    async function getAllListing() {
      let promise: DocumentData[] = [];
      favoriteLists.map((id, index) => {
        promise.push(firebase.getFavoriteListing(id) as DocumentData);
      });
      let allPromises = await Promise.all(promise);
      let listingDocArr: DocumentData[] = [];
      allPromises.forEach((doc) => {
        listingDocArr.push(doc);
      });

      setAllListingData(listingDocArr.reverse());
      console.log(listingDocArr);
    }
    getAllListing();
  }, []);
  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={`確定刪除房源`}
          notDefaultBtn={`取消`}
          defaultBtn={`刪除`}
          clickClose={() => setIsShown(false)}
          clickFunction={() => removeFromFavoriteLists()}
        />
      )}
      <Title>喜歡列表</Title>
      <Hr />
      {loading ? (
        <Loading />
      ) : (
        favoriteLists &&
        allListingData.map((f, index) => (
          <ListingWrapper to={`/listing/${f.id}`} key={`favoriteLists${index}`}>
            <ListingItem listingDocData={f}></ListingItem>
            <FavoriteIcon onClick={(e) => handleLiked(e, f.id)}></FavoriteIcon>
          </ListingWrapper>
        ))
      )}
    </Wrapper>
  );
}

export default FollowedList;
