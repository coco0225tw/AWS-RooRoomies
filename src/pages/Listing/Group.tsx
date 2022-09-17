import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { firebase, db, timestamp } from '../../utils/firebase';
import {
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  query,
  FieldValue,
  serverTimestamp,
} from 'firebase/firestore';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { groupType } from '../../redux/Group/GroupType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  // align-items: flex-start;
  width: 100%;
  // height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const ConditionArea = styled.div`
  display: flex;
  //   flex-direction: column;
  justify-content: space-between;
  width: 80%;
`;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  align-self: flex-end;
  &:hover {
    background-color: #222;
  }
`;
const SingleGroup = styled.div``;
const SingleGroupWrapper = styled.div`
  display: flex;
`;

const AddToGroup = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
`;

const UserPic = styled(AddToGroup)<{ img: string }>`
  background-image: url(${(props) => props.img});
  background-size: 40px 40px;
`;
function Group({
  peopleAmount,
  listingId,
  listingTitle,
}: {
  peopleAmount: number;
  listingId: string;
  listingTitle: string;
}) {
  const dispatch = useDispatch();
  const [groups, setGroups] = useState<Array<groupType>>([]);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const getGroup = useSelector((state: RootState) => state.GroupReducer) as Array<groupType>;
  const newGroup = {
    users: Array(peopleAmount).fill(null),
    chatRoomId: '',
    isBooked: false,
  };
  function addGroup() {
    dispatch({ type: 'ADD_GROUP', payload: { newGroup } });
  }
  function removeGroup(index: number) {
    dispatch({ type: 'REMOVE_GROUP', payload: { index } });
  }
  async function addUserToGroup(groupId: number, userId: number) {
    dispatch({ type: 'ADD_USER_TO_GROUP', payload: { groupId, userId, userInfo } });
    await firebase.addUserToGroup(listingId, getGroup);
    let index = getGroup[groupId].users.indexOf(null);
    if (index === -1) {
      console.log('make chatRooms');
      let userIds = getGroup[groupId].users.map((u, index) => {
        return u!.userId;
      });
      console.log(userIds);
      await firebase.createChatRoom(userIds, listingId, listingTitle, getGroup, groupId);
    }
  }
  useEffect(() => {
    if (peopleAmount !== undefined) {
      const groupQuery = doc(db, 'listings', listingId);
      const getAllGroup = onSnapshot(groupQuery, (snapshot) => {
        console.log(snapshot.data()!.matchGroup);
        const groups = [...snapshot.data()!.matchGroup];
        dispatch({ type: 'ADD_GROUP_FROM_FIREBASE', payload: { groups } });
      });
    }
  }, [peopleAmount]);
  return (
    <Wrapper>
      <h1>湊團</h1>
      {getGroup.length !== 0 &&
        getGroup.map((group, gIndex) => (
          <SingleGroup key={`group${gIndex}`}>
            <SingleGroupWrapper>
              <div>團{gIndex + 1}</div>
              {group.users.map((user, index) =>
                user === null ? (
                  <AddToGroup onClick={() => addUserToGroup(gIndex, index)} key={`user${index}`}>
                    +
                  </AddToGroup>
                ) : (
                  <UserPic
                    // onClick={() => addUserToGroup(gIndex, index)}
                    key={`user${index}`}
                    img={user.userPic}
                  ></UserPic>
                )
              )}
              <SubmitBtn onClick={() => removeGroup(gIndex)}>刪除團</SubmitBtn>
            </SingleGroupWrapper>
          </SingleGroup>
        ))}
      <SubmitBtn onClick={() => addGroup()}>加新的團</SubmitBtn>
    </Wrapper>
  );
}

export default Group;
