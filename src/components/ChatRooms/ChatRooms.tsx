import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { getFirestore, getDocs, updateDoc, doc, addDoc, collection, Timestamp, onSnapshot } from 'firebase/firestore';
const Wrapper = styled.div`
  top: 40vh;
  //   bottom: 0vh
  position: fixed;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: center;
  //   align-items: flex-start;

  width: 50%;
  height: 50vh;
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
const UserPic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
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
  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    async function getAllMessages() {
      const data = await firebase.getMessagesSubCollection('D4f902RqCnFxfmzLVt0h');
      console.log(data);
    }
    getAllMessages();
  }, []);
  return (
    <Wrapper>
      <SectionWrapper>
        <MessagesArea>
          {Array(10)
            .fill(undefined)
            .map((el, index) => (
              <Message key={`message${index}`}>
                <UserInfo>
                  <UserPic>圖片</UserPic>
                  <UserName>名字</UserName>
                </UserInfo>
                <UserMessage>訊息</UserMessage>
                <SendTime>時間</SendTime>
              </Message>
            ))}
        </MessagesArea>
        <InputArea>
          <InputMessageBox placeholder={'輸入訊息'}></InputMessageBox>
          <SubmitBtn>送出</SubmitBtn>
        </InputArea>
      </SectionWrapper>
    </Wrapper>
  );
}

export default ChatRooms;
