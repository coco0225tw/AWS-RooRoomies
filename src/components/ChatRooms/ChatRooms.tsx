import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, collection, onSnapshot, QueryDocumentSnapshot, DocumentData, query, where } from 'firebase/firestore';

import { RootState } from '../../redux/rootReducer';
import { chatRoomAction } from '../../redux/ChatRoom/ChatRoomAction';
import { firebase, db } from '../../utils/firebase';
import { PopupComponent } from '../../components/Popup';
import chat from '../../assets/chat.png';

const Wrapper = styled.div<{ isShown: boolean }>`
  bottom: ${(props) => (props.isShown ? '0px' : '50px')};
  right: ${(props) => (props.isShown ? '120px' : '50px')};
  position: fixed;
  display: flex;
  z-index: 5;
  background-color: white;
  width: ${(props) => (props.isShown ? '360px' : 'auto')};
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  height: ${(props) => (props.isShown ? '500px' : 'auto')};
  box-shadow: ${(props) => (props.isShown ? 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' : '')};
  border-radius: ${(props) => (props.isShown ? '8px 8px 8px 8px ' : '50%')};
  color: #4f5152;
  @media screen and (max-width: 900px) {
    width: ${(props) => (props.isShown ? '90%' : 'auto')};
    height: ${(props) => props.isShown && '90%'};
    right: ${(props) => (props.isShown ? 'auto' : '50px')};
    left: ${(props) => props.isShown && '50%'};
    top: ${(props) => props.isShown && '50%'};
    /* bottom: ${(props) => props.isShown && '0'}; */
    transform: ${(props) => props.isShown && 'translate(-50%,-50%)'};
  }
  @media screen and (max-width: 550px) {
    height: ${(props) => (props.isShown ? 'calc(100vh - 180px)' : 'auto')};
  }
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
  display: ${(props) => (props.isShown ? 'none' : 'block')};
  @media screen and (max-width: 550px) {
    width: 60px;
    height: 60px;
    background-size: 40px 40px;
  }
`;
const SectionWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  height: 80%;
  flex-direction: column;
`;

const MsgWrapper = styled.div`
  overflow-y: scroll;
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: column;
  padding: 0px 12px;
  height: 100%;
  /* justify-content: flex-end;
   */
`;
const InputArea = styled.div`
  display: flex;
  background-color: #c77155;
  height: 48px;
  border-radius: 0 0 8px 8px;
  align-items: center;
  justify-content: center;
  padding: 0 1%;
  @media screen and (max-width: 900px) {
    justify-content: space-around;
  }
`;
const Message = styled.div<{ auth: boolean }>`
  width: 80%;
  align-self: ${(props) => (props.auth ? 'flex-end' : 'flex-start')};
`;

const UserInfo = styled.div``;

const UserPic = styled.div<{ pic: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-image: url(${(props) => props.pic});
  background-size: cover;
  background-position: center center;
`;
const UserMessage = styled.div`
  word-break: break-all;
  padding: 0 12px;
  border-radius: 8px;
  line-height: 40px;
`;

const InputMessageBox = styled.input`
  border: none;
  outline: none;
  padding: 12px;
  font-size: 20px;
  border-radius: 20px;
  width: 96%;
  height: 80%;

  @media screen and (max-width: 900px) {
    width: auto;
    flex-grow: 1;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Tabs = styled.div`
  width: 100%;
  display: flex;
  border-radius: 8px 8px 0 0;
  align-items: center;
  background-color: #c77155;
`;
const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Tab = styled.div<{ isChoose: boolean }>`
  font-size: 20px;
  letter-spacing: 4px;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  border-bottom: ${(props) => (props.isChoose ? 'solid 2px #c77155' : '')};
  color: ${(props) => (props.isChoose ? '#c77155' : '#4f5152')};
  cursor: pointer;
  border-radius: 8px 0 0 0;
  color: #ffffff;
  &:hover {
    border-bottom: ${(props) => (props.isChoose ? '' : 'solid 2px #4f5152')};
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 12px;
`;

const OptionsBtn = styled.div`
  width: 32px;
  height: 32px;
  text-align: center;
  vertical-align: center;
  border-radius: 50%;
  margin-right: 12px;
  cursor: pointer;
  font-size: 20px;
  flex-shrink: 0;
  background-color: #ffffff;
  color: #c77155;
  transition-duration: 0.1s;
  &:hover {
    transform: scale(1.1);
  }
`;
const Close = styled(OptionsBtn)<{ isShown: boolean }>`
  display: ${(props) => (props.isShown ? 'block' : 'none')};
`;
const BackBtn = styled(OptionsBtn)`
  margin-left: 12px;
`;
const ListingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  flex-direction: column;
`;
const Listing = styled.div<{ isClick: boolean }>`
  width: 100%;
  padding: 20px;
  font-size: 20px;
  letter-spacing: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background-color: #fff7f4;
  border-bottom: solid 1px #ffffff;
`;
const GreaterThan = styled(OptionsBtn)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: none;

  font-weight: bold;
  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
`;
const AddMsgIcon = styled.div`
  display: none;
  font-size: 24px;
  font-weight: bold;
  color: #c77155;
  @media screen and (max-width: 900px) {
    width: 32px;
    height: 32px;
    margin-left: 12px;
    background-color: #fff;
    border-radius: 50%;
    display: block;
    text-align: center;
    line-height: 32px;
  }
`;
const AutoScroll = styled.div``;
function ChatRooms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [houseHuntingData, setHouseHuntingData] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const getChatRoom = useSelector((state: RootState) => state.ChatRoomReducer);
  const [allMessages, setAllMessages] = useState<Msg[]>([]);
  const autoScrollRef = useRef<HTMLDivElement>(null);
  const msgInputRef = useRef<HTMLInputElement>(null);
  interface Msg {
    userMsg: string;
    sendTime: number;
    userName: string;
    userId: string;
    userPic: string;
  }

  async function senMsg() {
    const msg: Msg = {
      userMsg: msgInputRef.current!.value,
      sendTime: Date.now(),
      userName: userInfo.name,
      userId: userInfo.uid,
      userPic: userInfo.image,
    };
    await firebase.sendMessage(getChatRoom.chatRoomId as string, allMessages, msg);
  }

  function onSnapshotMessages(chooseRoomId: string) {
    const chatRoomQuery = doc(db, 'chatRooms', chooseRoomId);

    const getAllMessages = onSnapshot(chatRoomQuery, (snapshot) => {
      if (snapshot.data()) {
        setAllMessages(snapshot.data()!.msg);
      } else {
        getAllMessages();
      }
    });
  }

  useEffect(() => {
    const houseHuntingRef = collection(db, 'chatRooms');
    const userChatRef = query(houseHuntingRef, where('userId', 'array-contains', userInfo.uid));

    if (authChange) {
      let onSnapShotData = onSnapshot(userChatRef, (querySnapshot) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        querySnapshot.forEach((doc) => {
          houseHuntingDocArr.push(doc);
        });

        setHouseHuntingData(houseHuntingDocArr);
      });
    }
  }, [userInfo]);
  useEffect(() => {
    setAllMessages([]);

    if (getChatRoom.chatRoomId) {
      onSnapshotMessages(getChatRoom.chatRoomId as string);
    }
  }, [getChatRoom.chatRoomId]);

  if (authChange) {
    return (
      <Wrapper isShown={getChatRoom.isOpen && houseHuntingData.length !== 0}>
        <ChatIcon
          isShown={getChatRoom.isOpen && houseHuntingData.length !== 0}
          onClick={() => {
            dispatch({ type: chatRoomAction.OPEN_CHAT });
            if (houseHuntingData.length !== 0 && !getChatRoom.chatRoomOpenState) {
              dispatch({
                type: chatRoomAction.CHECK_CHATROOM,
                payload: { chatRoom: true },
              });
            }
          }}
        />

        {houseHuntingData.length === 0 && getChatRoom.isOpen ? (
          <PopupComponent
            msg={`你目前\n沒有預約和湊團哦`}
            notDefaultBtn={`取消`}
            defaultBtn={`去逛逛`}
            clickClose={() => dispatch({ type: chatRoomAction.CLOSE_CHAT })}
            clickFunction={() => {
              dispatch({ type: chatRoomAction.CLOSE_CHAT });
              navigate('/');
            }}
          />
        ) : (
          houseHuntingData.length !== 0 &&
          getChatRoom.isOpen && (
            <HeaderBar>
              <Tabs>
                {getChatRoom.chatRoomId && getChatRoom.chatRoomOpenState && (
                  <BackBtn
                    onClick={() => {
                      dispatch({ type: chatRoomAction.CLOSE_CHATROOM_STATE });
                    }}
                  >
                    &larr;
                  </BackBtn>
                )}

                <Tab isChoose={true}>
                  {getChatRoom.chatRoomOpenState &&
                    getChatRoom.chatRoomId &&
                    houseHuntingData.find((h) => h && h.id === getChatRoom.chatRoomId).data().listingTitle}
                  {!getChatRoom.chatRoomOpenState && '你的聊天室'}
                </Tab>
                <OptionWrapper>
                  <Close
                    isShown={getChatRoom.isOpen && houseHuntingData.length !== 0}
                    onClick={() => dispatch({ type: chatRoomAction.CLOSE_CHAT })}
                  >
                    &#10006;
                  </Close>
                </OptionWrapper>
              </Tabs>
              {getChatRoom.chatRoomOpenState ? (
                <React.Fragment>
                  <SectionWrapper>
                    <MsgWrapper>
                      {allMessages &&
                        allMessages.map((el, index) => (
                          <Message auth={el.userId === userInfo.uid} key={`message${index}`}>
                            {el.userId === userInfo.uid ? (
                              <MessageWrapper style={{ justifyContent: 'flex-end' }}>
                                <UserMessage
                                  style={{
                                    marginRight: '12px',
                                    textAlign: 'right',
                                    backgroundColor: '#fff7f4 ',
                                  }}
                                >
                                  {el.userMsg}
                                </UserMessage>
                                <UserInfo>
                                  <UserPic pic={el.userPic} />
                                </UserInfo>
                              </MessageWrapper>
                            ) : (
                              <MessageWrapper>
                                <UserInfo>
                                  <UserPic pic={el.userPic} />
                                </UserInfo>
                                <UserMessage style={{ marginLeft: '12px', backgroundColor: ' #f3f2ef' }}>
                                  {el.userMsg}
                                </UserMessage>
                              </MessageWrapper>
                            )}
                          </Message>
                        ))}
                      <AutoScroll ref={autoScrollRef} />
                    </MsgWrapper>
                  </SectionWrapper>
                  <InputArea>
                    <InputMessageBox
                      placeholder={'...'}
                      ref={msgInputRef}
                      onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        event.stopPropagation();
                        if (event.key === 'Enter') {
                          if (msgInputRef.current.value.trim() === '') {
                            msgInputRef.current!.value = '';
                            return;
                          } else {
                            senMsg();
                            msgInputRef.current!.value = '';
                            autoScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    />
                    <AddMsgIcon
                      onClick={() => {
                        if (msgInputRef.current.value.trim() === '') {
                          msgInputRef.current!.value = '';
                          return;
                        } else {
                          senMsg();
                          msgInputRef.current!.value = '';
                          autoScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      &#43;
                    </AddMsgIcon>
                  </InputArea>
                </React.Fragment>
              ) : (
                <ListingWrapper>
                  {houseHuntingData.map((house) => (
                    <Listing
                      onClick={() => {
                        dispatch({
                          type: chatRoomAction.OPEN_CHATROOM,
                          payload: {
                            chatRoomId: house.id,
                          },
                        });
                        setTimeout(() => {
                          dispatch({
                            type: chatRoomAction.OPEN_CHATROOM_STATE,
                          });
                        }, 50);
                      }}
                      isClick={getChatRoom.chatRoomId === house.id}
                      key={`houseHuntingChat${house.id}`}
                    >
                      {house.data().listingTitle}
                      <GreaterThan>&gt;</GreaterThan>
                    </Listing>
                  ))}
                </ListingWrapper>
              )}
            </HeaderBar>
          )
        )}
      </Wrapper>
    );
  } else {
    return null;
  }
}

export default ChatRooms;
