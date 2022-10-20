enum chatRoomAction {
  CHECK_CHATROOM = 'CHECK_CHATROOM',
  OPEN_CHAT = 'OPEN_CHAT',
  CLOSE_CHAT = 'CLOSE_CHAT',
  OPEN_CHATROOM_STATE = 'OPEN_CHATROOM_STATE',
  CLOSE_CHATROOM_STATE = 'CLOSE_CHATROOM_STATE',
  OPEN_CHATROOM = 'OPEN_CHATROOM',
  INITIAL_CHATROOM_STATE = 'INITIAL_CHATROOM_STATE',
}

interface checkChatRoom {
  type: chatRoomAction.CHECK_CHATROOM;
  payload: { chatRoom: boolean };
}
interface openChat {
  type: chatRoomAction.OPEN_CHAT;
}

interface closeChat {
  type: chatRoomAction.CLOSE_CHAT;
}
interface openChatRoomState {
  type: chatRoomAction.OPEN_CHATROOM_STATE;
}
interface closeChatRoomState {
  type: chatRoomAction.CLOSE_CHATROOM_STATE;
}
interface openChatRoom {
  type: chatRoomAction.OPEN_CHATROOM;
  payload: { chatRoomId: boolean };
}

interface initialChatRoomState {
  type: chatRoomAction.INITIAL_CHATROOM_STATE;
}
type chatRoomActionType =
  | checkChatRoom
  | openChat
  | closeChat
  | openChatRoomState
  | closeChatRoomState
  | openChatRoom
  | initialChatRoomState;

export { chatRoomAction, chatRoomActionType };
