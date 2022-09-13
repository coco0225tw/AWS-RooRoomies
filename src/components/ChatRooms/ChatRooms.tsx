import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
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
const Wrapper = styled.div<{ closeAndOpen: boolean }>`
  top: ${(props) => (props.closeAndOpen ? '40vh' : '90vh')};
  //   bottom: 0vh
  position: fixed;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: center;
  //   align-items: flex-start;

  width: 30%;
  height: ${(props) => (props.closeAndOpen ? '50vh' : '10vh')};
  //margin: auto;
  z-index: 1;
  background-color: white;
`;

const SectionWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  //   align-items: center;
`;
const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
const MessagesArea = styled.div`
  flex-grow: 1;
  overflow: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;
const InputArea = styled.div`
  display: flex;
`;
const Message = styled.div<{ auth: boolean }>`
  display: flex;
  width: 80%;
  align-self: ${(props) => (props.auth ? 'flex-end' : 'flex-start')};
`;

const UserInfo = styled.div``;
const UserName = styled.div`
  font-size: 4px;
`;
const UserPic = styled.div<{ pic: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-image: url(${(props) => props.pic});
  background-size: cover;
`;
const UserMessage = styled.div`
  flex-grow: 1;
  border-radius: 16px;
`;
const SendTime = styled.div``;
const InputMessageBox = styled.input`
  align-self: flex-end;
  padding: 4px;
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

const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
`;
const Tabs = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
  // overflow-y: hidden;
`;
const Tab = styled.div`
  // width: 20%;
  font-size: 12px;
  height: 100%;
  padding: 10px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
function ChatRooms() {
  const [houseHuntingData, setHouseHuntingData] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [closeAndOpen, setCloseAndOpen] = useState<boolean>(false);
  const [chooseRoomId, setChooseRoomId] = useState<string>('');
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  interface Msg {
    userMsg: string;
    sendTime: number;
    userName: string;
    userId: string;
    userPic: string;
  }
  const msgInputRef = useRef<HTMLInputElement>(null);
  const [allMessages, setAllMessages] = useState<DocumentData[]>([]);
  async function senMsg() {
    const msg: Msg = {
      userMsg: msgInputRef.current!.value,
      sendTime: Date.now(),
      userName: userInfo.name,
      userId: userInfo.uid,
      userPic: userInfo.image,
    };
    await firebase.sendMessage(chooseRoomId!, allMessages, msg);
  }

  function onSnapshotMessages(chooseRoomId: string) {
    const chatRoomQuery = doc(db, 'chatRooms', chooseRoomId);
    console.log('choose');
    const getAllMessages = onSnapshot(chatRoomQuery, (snapshot) => {
      console.log(snapshot);
      setAllMessages(snapshot.data()!.msg);
    });
  }
  useEffect(() => {
    async function getAllHouseHuntingData() {
      await firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        console.log(listing);
        listing.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });
        setHouseHuntingData(houseHuntingDocArr);
      });
    }

    getAllHouseHuntingData();
  }, [userInfo]);
  return (
    <Wrapper closeAndOpen={closeAndOpen}>
      <HeaderBar>
        <Tabs>
          {houseHuntingData &&
            houseHuntingData.map((h, index) => (
              <Tab
                onClick={() => {
                  onSnapshotMessages(h.id);
                  setChooseRoomId(h.id);
                }}
                key={`house${index}`}
              >
                {h.data().listingId}
              </Tab>
            ))}
        </Tabs>
        <SubmitBtn onClick={() => setCloseAndOpen(false)}>x</SubmitBtn>
        <SubmitBtn onClick={() => setCloseAndOpen(true)}>o</SubmitBtn>
      </HeaderBar>

      {closeAndOpen && (
        <SectionWrapper>
          <MessagesArea>
            {allMessages &&
              allMessages.map((el, index) => (
                <Message auth={el.userId === userInfo.uid} key={`message${index}`}>
                  {el.userId === userInfo.uid ? (
                    <MessageWrapper>
                      <UserMessage>{el.userMsg}</UserMessage>
                      <UserInfo>
                        <UserPic pic={el.userPic}></UserPic>
                        <UserName>{el.userName}</UserName>
                      </UserInfo>
                    </MessageWrapper>
                  ) : (
                    <MessageWrapper>
                      <UserInfo>
                        <UserPic pic={el.userPic}></UserPic>
                        <UserName>{el.userName}</UserName>
                      </UserInfo>
                      <UserMessage>{el.userMsg}</UserMessage>
                    </MessageWrapper>
                  )}
                </Message>
              ))}
          </MessagesArea>
          <InputArea>
            <InputMessageBox placeholder={'輸入訊息'} ref={msgInputRef}></InputMessageBox>
            <SubmitBtn onClick={senMsg}>送出</SubmitBtn>
          </InputArea>
        </SectionWrapper>
      )}
    </Wrapper>
  );
}

export default ChatRooms;
