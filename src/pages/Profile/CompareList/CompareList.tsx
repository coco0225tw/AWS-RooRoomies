import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { firebase } from '../../../utils/firebase';
import addIcon from '../../../assets/add.png';
import unAddIcon from '../../../assets/unAdd.png';
import { PopupComponent, PopupImage } from '../../../components/Popup';
import { Link } from 'react-router-dom';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 50vh;
  margin: auto;
  overflow-x: scroll;
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

const Test = styled.div`
  width: 50px;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Drop = styled.div`
  height: 100px;
`;
function CompareList() {
  const dispatch = useDispatch();
  const compareLists = useSelector((state: RootState) => state.GetCompareListsReducer);
  const dndLists = useSelector((state: RootState) => state.GetDndListsReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  function handleCompare(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    async function removeFromCompareLists() {
      await firebase.removeFromCompareLists(userInfo.uid, listingId);
    }
    console.log('clicked');
    removeFromCompareLists();
    dispatch({ type: 'REMOVE_FROM_COMPARELISTS', payload: { id: listingId } });
  }

  function handleDnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>, listingId: string) {
    e.stopPropagation();
    e.preventDefault();
    async function removeFromDndLists() {
      await firebase.removeFromDndLists(userInfo.uid, listingId);
    }
    removeFromDndLists();
    dispatch({ type: 'REMOVE_FROM_DNDLISTS', payload: { id: listingId } });
  }
  return (
    <Wrapper>
      <div>追蹤物件</div>
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination, draggableId } = result;
          if (!destination) {
            return;
          }
          const reorder = (list: any, startIndex: any, endIndex: any) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
          };
          const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
            const sourceClone = Array.from(source);
            const destClone = Array.from(destination);
            const [removed] = sourceClone.splice(droppableSource.index, 1);

            destClone.splice(droppableDestination.index, 0, removed);

            const result: any = {};
            result[droppableSource.droppableId] = sourceClone;
            result[droppableDestination.droppableId] = destClone;
            return result;
          };

          async function updateCompareListsField(compareLists: any) {
            await firebase.updateCompareListsField(userInfo.uid, compareLists);
          }
          async function updateDndListsField(dndLists: any) {
            await firebase.updateDndListsField(userInfo.uid, dndLists);
          }
          const id2List = {
            compareLists: compareLists,
            dndLists: dndLists,
          };
          const getList = (id: string | keyof typeof id2List) => id2List[id as keyof typeof id2List];
          if (source.droppableId === destination.droppableId) {
            const items = reorder(getList(source.droppableId), source.index, destination.index);

            let state = { items };

            if (source.droppableId === 'compareLists') {
              console.log(items);
              dispatch({ type: 'REODER_AND_MOVE_COMPARELISTS', payload: { compareLists: items } });
              updateCompareListsField(items);
            }

            if (source.droppableId === 'dndLists') {
              dispatch({ type: 'REODER_AND_MOVE_DNDLISTS', payload: { dndLists: items } });
              updateDndListsField(items);
            }
          } else {
            const result: any = move(
              getList(source.droppableId),
              getList(destination.droppableId),
              source,
              destination
            );
            if (result.compareLists) {
              dispatch({ type: 'REODER_AND_MOVE_COMPARELISTS', payload: { compareLists: result.compareLists } });
              updateCompareListsField(result.compareLists);
            }
            if (result.dndLists) {
              dispatch({ type: 'REODER_AND_MOVE_DNDLISTS', payload: { dndLists: result.dndLists } });
              updateDndListsField(result.dndLists);
            }
          }
        }}
      >
        <Drop>
          <Droppable direction="horizontal" droppableId="compareLists">
            {(provided, snapshot) => (
              <div style={{ display: 'flex' }} ref={provided.innerRef} {...provided.droppableProps}>
                {compareLists.map((item, index) => (
                  <Draggable key={`1${index}`} draggableId={`compare${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>{item}</div>
                        <CompareIcon onClick={(e) => handleCompare(e, item)}></CompareIcon>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Drop>
        <Drop>
          <Droppable key="d2" direction="horizontal" droppableId="dndLists">
            {(provided, snapshot) => (
              <div style={{ display: 'flex' }} ref={provided.innerRef} {...provided.droppableProps}>
                {dndLists.map((item, index) => (
                  <Draggable key={`2${index}`} draggableId={`2${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>{item}</div>
                        <CompareIcon onClick={(e) => handleDnd(e, item)}></CompareIcon>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Drop>
      </DragDropContext>
    </Wrapper>
  );
}

export default CompareList;
