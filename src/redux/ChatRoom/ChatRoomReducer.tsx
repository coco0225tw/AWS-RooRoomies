interface chatRoomType {
  isOpen: boolean;
  chatRoom: boolean;
  chatRoomOpenState: boolean;
  chatRoomId: null | string;
}
type Action =
  | { type: "OPEN_CHAT" }
  | { type: "CLOSE_CHAT" }
  | { type: "OPEN_CHATROOM"; payload: { chatRoomId: string } }
  | { type: "CHECK_CHATROOM"; payload: { chatRoom: boolean } }
  | { type: "OPEN_CHATROOM_STATE" }
  | { type: "CLOSE_CHATROOM_STATE" }
  | { type: "INITIAL_CHATROOM_STATE" };
const alertInitialState = {
  isOpen: false,
  chatRoom: false,
  chatRoomOpenState: false,
  chatRoomId: null,
};

export default function ChatRoom(state = alertInitialState, action: Action) {
  switch (action.type) {
    case "OPEN_CHAT": {
      let newState = { ...state };
      return {
        ...newState,
        isOpen: true,
      };
    }

    case "CLOSE_CHAT": {
      let newState = { ...state };
      return {
        ...newState,
        isOpen: false,
      };
    }
    case "OPEN_CHATROOM": {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomId: action.payload.chatRoomId,
      };
    }
    case "CHECK_CHATROOM": {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomId: action.payload.chatRoom,
      };
    }
    case "OPEN_CHATROOM_STATE": {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomOpenState: true,
      };
    }
    case "CLOSE_CHATROOM_STATE": {
      let newState = { ...state };
      return {
        ...newState,
        chatRoomOpenState: false,
      };
    }
    default:
      return state;
  }
}
