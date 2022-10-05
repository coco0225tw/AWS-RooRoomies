import chatRoomType from "./ChatRoomType";
import { chatRoomAction, chatRoomActionType } from "./ChatRoomAction";

const alertInitialState = {
  chatRoom: false,
  isOpen: false,
  chatRoomOpenState: false,
  chatRoomId: null,
} as chatRoomType;

export default function ChatRoom(
  state = alertInitialState,
  action: chatRoomActionType
) {
  switch (action.type) {
    case chatRoomAction.OPEN_CHAT: {
      let newState = { ...state };
      return {
        ...newState,
        isOpen: true,
      };
    }

    case chatRoomAction.CLOSE_CHAT: {
      let newState = { ...state };
      return {
        ...newState,
        isOpen: false,
      };
    }
    case chatRoomAction.OPEN_CHATROOM: {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomId: action.payload.chatRoomId,
      };
    }
    case chatRoomAction.CHECK_CHATROOM: {
      let newState = { ...state };
      return {
        ...newState,
        chatRoom: action.payload.chatRoom,
      };
    }
    case chatRoomAction.OPEN_CHATROOM_STATE: {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomOpenState: true,
      };
    }
    case chatRoomAction.CLOSE_CHATROOM_STATE: {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomOpenState: false,
      };
    }
    case chatRoomAction.INITIAL_CHATROOM_STATE:
      return alertInitialState;
    default:
      return state;
  }
}
