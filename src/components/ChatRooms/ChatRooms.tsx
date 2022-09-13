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
`;
const InputArea = styled.div`
  display: flex;
`;
const Message = styled.div`
  display: flex;
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

function ChatRooms() {
  const [closeAndOpen, setCloseAndOpen] = useState<boolean>(true);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  interface Msg {
    userMsg: string;
    sendTime: number;
    userName: string;
    userId: string;
    userPic: string;
  }
  const msgInputRef = useRef<HTMLInputElement>(null);
  const [allMessages, setAllMessages] = useState<DocumentData[]>();
  async function senMsg() {
    const msg: Msg = {
      userMsg: msgInputRef.current!.value,
      sendTime: Date.now(),
      userName: userInfo.name,
      userId: userInfo.uid,
      userPic: userInfo.image,
    };
    await firebase.sendMessage('D4f902RqCnFxfmzLVt0h', allMessages, msg);
  }
  useEffect(() => {
    const chatRoomQuery = doc(db, 'chatRooms', 'D4f902RqCnFxfmzLVt0h');
    const getAllMessages = onSnapshot(chatRoomQuery, (snapshot) => {
      // console.log('send');
      setAllMessages(snapshot.data()!.msg);
    });
  }, []);
  return (
    <Wrapper closeAndOpen={closeAndOpen}>
      <SubmitBtn onClick={() => setCloseAndOpen(false)}>x</SubmitBtn>
      <SubmitBtn onClick={() => setCloseAndOpen(true)}>o</SubmitBtn>
      {closeAndOpen && (
        <SectionWrapper>
          <MessagesArea>
            {allMessages &&
              allMessages.map((el, index) => (
                <Message key={`message${index}`}>
                  <UserInfo>
                    <UserPic pic={el.userPic}></UserPic>
                    <UserName>{el.userName}</UserName>
                  </UserInfo>
                  <UserMessage>{el.userMsg}</UserMessage>
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
