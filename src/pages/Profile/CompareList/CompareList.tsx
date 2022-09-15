import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { firebase } from '../../../utils/firebase';
import addIcon from '../../../assets/add.png';
import unAddIcon from '../../../assets/unAdd.png';
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

const CompareIcon = styled.div`
  background-image: url(${addIcon});
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`;
function CompareList() {
  const dispatch = useDispatch();
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  function handleCompare(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    async function removeFromCompareLists() {
      await firebase.removeFromCompareLists(userInfo.uid, listingId);
    }
    removeFromCompareLists();
    dispatch({ type: 'REMOVE_FROM_COMPARELIST', payload: { id: listingId } });
  }
  return (
    <Wrapper>
      <div>追蹤物件</div>
      {compareLists &&
        compareLists.map((f, index) => (
          <div key={`compareLists${index}`}>
            <div>{f}</div>
            <CompareIcon onClick={(e) => handleCompare(e, f)}></CompareIcon>
          </div>
        ))}
    </Wrapper>
  );
}

export default CompareList;
