import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { firebase, db, timestamp } from "../../utils/firebase";
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
} from "firebase/firestore";
import chat from "../../assets/chat.png";
const Wrapper = styled.div<{ isShown: boolean }>`
  bottom: ${(props) => (props.isShown ? "0px" : "50px")};
  right: ${(props) => (props.isShown ? "120px" : "50px")};
  position: fixed;
  display: flex;
  z-index: 1;
  background-color: white;
  width: ${(props) => (props.isShown ? "30vw" : "auto")};
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  height: ${(props) => (props.isShown ? "500px" : "auto")};
  box-shadow: ${(props) =>
    props.isShown ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : ""};
  border-radius: ${(props) => (props.isShown ? "8px 8px 0px 0px " : "50%")};
  color: #4f5152;
`;
const ChatIcon = styled.div<{ isShown: boolean }>`
  width: 80px;
  height: 80px;
  background-image: url(${chat});
  background-size: 60px 60px;
  border-radius: 50%;
  background-color: #c77155;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  display: ${(props) => (props.isShown ? "none" : "block")};
`;
const SectionWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  height: 80%;
  flex-direction: column;
  // overflow: scroll;
  // overflow-x: hidden;
`;
const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
const MessagesArea = styled.div`
  flex-grow: 1;
  // overflow: scroll;
  // overflow-x: hidden;
  // display: flex;
  // flex-direction: column;
`;

const MsgWrapper = styled.div`
  // overflow: scroll;
  // overflow-x: hidden;
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: column;
  flex-grow: 1;
  padding: 0px 12px;
  // height: 100%;
  justify-content: flex-end;
`;
const InputArea = styled.div`
  display: flex;
  // padding: 4px 20px;
  background-color: #c77155;
  height: 48px;
`;
const Message = styled.div<{ auth: boolean }>`
  // display: flex;
  width: 80%;
  align-self: ${(props) => (props.auth ? "flex-end" : "flex-start")};
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
  background-position: center center;
`;
const UserMessage = styled.div`
  // flex: 0 1 auto;
  // max-width: px;
  word-break: break-all;
  // flex-grow: 1;
  padding: 0 12px;
  border-radius: 8px;
  // line-break: auto;
`;
const SendTime = styled.div``;
const InputMessageBox = styled.input`
  border: none;
  outline: none;
  // align-self: flex-end;
  padding: 12px;
  font-size: 20px;
  border-radius: 20px;
  width: 96%;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  flex-direction: column;
  width: 100%;
  // overflow-x: scroll;
`;
const Tabs = styled.div`
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  // overflow-x: scroll;
  // height: 100%;
  width: 100%;
  // overflow-y: hidden;
`;
const TabsWrapper = styled.div`
  // width: 100%;
  // overflow: hidden;
  // align-items: center;
  display: -webkit-box;
`;
const Tab = styled.div<{ isChoose: boolean }>`
  // width: 20%;
  // display: inline-block;
  font-size: 20px;
  letter-spacing: 4px;
  height: 100%;
  padding: 10px;
  border-bottom: ${(props) => (props.isChoose ? "solid 2px #c77155" : "")};
  color: ${(props) => (props.isChoose ? "#c77155" : "#4f5152")};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isChoose ? "#c77155" : "#ffffff")};
    color: ${(props) => (props.isChoose ? "#ffffff" : "#4f5152")};
    border-bottom: ${(props) => (props.isChoose ? "" : "solid 2px #4f5152")};
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 12px;
`;

const Close = styled.div<{ isShown: boolean }>`
  position: absolute;
  width: 32px;
  height: 32px;
  text-align: center;
  border-radius: 50%;
  line-height: 32px;
  cursor: pointer;
  font-size: 20px;
  right: 0;
  transform: translate(100%, -100%);
  border: solid 1px #ece2d5;
  color: #ece2d5;
  &:hover {
    color: #ffffff;
    border: solid 1px #ece2d5;
    background-color: #c77155;
  }
  display: ${(props) => (props.isShown ? "block" : "none")};
`;

function ChatRooms() {
  const [houseHuntingData, setHouseHuntingData] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [chooseRoomId, setChooseRoomId] = useState<string>("");
  const [allMessages, setAllMessages] = useState<DocumentData[]>();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  interface Msg {
    userMsg: string;
    sendTime: number;
    userName: string;
    userId: string;
    userPic: string;
  }
  const msgInputRef = useRef<HTMLInputElement>(null);

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
    const chatRoomQuery = doc(db, "chatRooms", chooseRoomId);
    // console.log('choose');
    const getAllMessages = onSnapshot(chatRoomQuery, (snapshot) => {
      // console.log(snapshot);
      setAllMessages(snapshot.data()!.msg);
    });
  }
  useEffect(() => {
    async function getAllHouseHuntingData() {
      await firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });
        setHouseHuntingData(houseHuntingDocArr);
      });
    }
    getAllHouseHuntingData();
  }, [authChange]);

  if (authChange) {
    return (
      <Wrapper isShown={isShown}>
        <ChatIcon
          isShown={isShown}
          onClick={() => {
            setIsShown(true);
            // console.log(houseHuntingData);
            if (houseHuntingData.length !== 0) {
              setChooseRoomId(houseHuntingData[0]?.id);
              setAllMessages(houseHuntingData[0]?.data().msg);
            }
          }}
        ></ChatIcon>
        <Close isShown={isShown} onClick={() => setIsShown(false)}>
          &#215;
        </Close>
        {isShown ? (
          houseHuntingData.length === 0 ? (
            <div>popup</div>
          ) : (
            <HeaderBar>
              <Tabs>
                <TabsWrapper>
                  {houseHuntingData.map((h, index) => (
                    <Tab
                      isChoose={h.id === chooseRoomId}
                      onClick={() => {
                        onSnapshotMessages(h.id);
                        setChooseRoomId(h.id);
                      }}
                      key={`house${index}`}
                    >
                      {h.data().listingTitle}
                    </Tab>
                  ))}
                </TabsWrapper>
              </Tabs>
              <SectionWrapper>
                {/* <MessagesArea> */}
                <MsgWrapper>
                  {allMessages &&
                    allMessages.map((el, index) => (
                      <Message
                        auth={el.userId === userInfo.uid}
                        key={`message${index}`}
                      >
                        {el.userId === userInfo.uid ? (
                          <MessageWrapper
                            style={{ justifyContent: "flex-end" }}
                          >
                            <UserMessage
                              style={{
                                marginRight: "12px",
                                textAlign: "right",
                                backgroundColor: "#fff7f4 ",
                              }}
                            >
                              {el.userMsg}
                            </UserMessage>
                            <UserInfo>
                              <UserPic pic={el.userPic}></UserPic>
                              {/* <UserName>{el.userName}</UserName> */}
                            </UserInfo>
                          </MessageWrapper>
                        ) : (
                          <MessageWrapper>
                            <UserInfo>
                              <UserPic pic={el.userPic}></UserPic>
                              {/* <UserName>{el.userName}</UserName> */}
                            </UserInfo>
                            <UserMessage style={{ marginLeft: "12px" }}>
                              {el.userMsg}
                            </UserMessage>
                          </MessageWrapper>
                        )}
                      </Message>
                    ))}
                </MsgWrapper>
                {/* </MessagesArea> */}
              </SectionWrapper>
              <InputArea>
                <InputMessageBox
                  placeholder={"..."}
                  ref={msgInputRef}
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    event.stopPropagation();
                    if (event.key === "Enter") {
                      if (msgInputRef.current.value.trim() === "") {
                        msgInputRef.current!.value = "";
                        return;
                      } else {
                        senMsg();
                        msgInputRef.current!.value = "";
                      }
                    }
                  }}
                ></InputMessageBox>
                {/* <SubmitBtn onClick={senMsg}>送出</SubmitBtn> */}
              </InputArea>
            </HeaderBar>
          )
        ) : null}
      </Wrapper>
    );
  } else {
    return null;
  }
}

export default ChatRooms;
