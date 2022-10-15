import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DocumentData } from 'firebase/firestore';

import { RootState } from '../../../redux/rootReducer';
import { firebase } from '../../../utils/firebase';
import { alertActionType } from '../../../redux/Alert/AlertAction';
import { getFavoriteAction } from '../../../redux/GetFavoriteListing/GetFavoriteListingAction';

import { PopupComponent } from '../../../components/Popup';
import { Loading } from '../../../components/Loading';
import { Title } from '../../../components/ProfileTitle';
import NoListing from '../../../components/NoData';
import ListingItem from '../../../components/ListingItem';
import Hr from '../../../components/Hr';
import likedIcon from '../../../assets/heart.png';
import dragIcon from '../../../assets/menu.png';
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

const FavoriteIcon = styled.div`
  background-image: url(${likedIcon});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
  position: absolute;
  background-position: center center;
  background-repeat: no-repeat;
  right: 20px;
  @media screen and (max-width: 1300px) {
    height: 28px;
    width: 28px;
    right: 8px;
    background-size: 20px 20px;
    border-radius: 8px;
    margin: 8px 8px 0 0;
    background-color: #fefefe;
  }
`;
const DragIcon = styled.div`
  background-image: url(${dragIcon});
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
  position: absolute;
  top: 20px;
  right: 20px;
  transition-duration: 0.2s;
  background-position: center center;
  background-repeat: no-repeat;

  :hover {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    height: 40px;
    width: 40px;
    border-radius: 4px;
  }
  @media screen and (max-width: 1300px) {
    height: 28px;
    width: 28px;
    right: 0px;
    background-size: 12px 12px;
    border-radius: 8px;
    top: 16px;
    background-color: #fefefe;
    :hover {
      background-color: lightgrey;
      height: 28px;
      width: 28px;
    }
  }
`;
const ListingWrap = styled.div`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 1300px) {
    width: 48%;
  }
  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;
const ListingWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  border: solid 1px #f3f2ef;
  width: 90%;
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 12px;
  @media screen and (max-width: 1300px) {
    margin-bottom: 12px;
    padding: 8px;
  }
`;
const Drop = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1300px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2%;
  }
`;
function FollowedList({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const favoriteLists = useSelector((state: RootState) => state.GetFavoriteListsReducer);

  const [allListingData, setAllListingData] = useState<DocumentData[]>([]);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [unLikeId, setUnLikeId] = useState<string>('');

  function handleLiked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    setIsShown(true);
    setUnLikeId(listingId);
  }
  async function removeFromFavoriteLists() {
    firebase.removeFromFavoriteLists(userInfo.uid, unLikeId).then(() => {
      dispatch({
        type: getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS,
        payload: { id: unLikeId },
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
        <Loading style={null} />
      ) : favoriteLists.length === 0 ? (
        <NoListing msg="尚未加入任何房源" />
      ) : (
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination, draggableId } = result;
            if (!destination) {
              return;
            }
            const reorder = (list: DocumentData[], startIndex: number, endIndex: number) => {
              const result = Array.from(list);
              const [removed] = result.splice(startIndex, 1);
              result.splice(endIndex, 0, removed);

              return result;
            };
            const newOrder = reorder(allListingData, source.index, destination.index);

            let state = { newOrder };
            const newArray = newOrder.map((data, id) => data.id);
            setAllListingData(newOrder);
            async function updateFavoriteLists() {
              firebase.updateFavoriteLists(userInfo.uid, newArray).then(() => {
                dispatch({ type: getFavoriteAction.REORDER_FAVORITE_LISTS, payload: { favoriteLists: newArray } });
                dispatch({
                  type: alertActionType.OPEN_NOTIFY_ALERT,
                  payload: {
                    alertMessage: '已更新順序',
                  },
                });
                setTimeout(() => {
                  dispatch({
                    type: alertActionType.CLOSE_ALERT,
                  });
                }, 3000);
              });
            }
            updateFavoriteLists();
          }}
        >
          <Drop>
            <Droppable droppableId="favoriteLists">
              {(provided, snapshot) => (
                <Drop ref={provided.innerRef} {...provided.droppableProps}>
                  {allListingData.map((item, index) => (
                    <Draggable key={`1${index}`} draggableId={`compare${index}`} index={index}>
                      {(provided, snapshot) => (
                        <ListingWrap {...provided.draggableProps} ref={provided.innerRef}>
                          <ListingWrapper to={`/listing/${item.id}`}>
                            <ListingItem listingDocData={item} />

                            <FavoriteIcon onClick={(e) => handleLiked(e, item.id)} />
                          </ListingWrapper>
                          <DragIcon {...provided.dragHandleProps} />
                        </ListingWrap>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Drop>
              )}
            </Droppable>
          </Drop>
        </DragDropContext>
      )}
    </Wrapper>
  );
}

export default FollowedList;
