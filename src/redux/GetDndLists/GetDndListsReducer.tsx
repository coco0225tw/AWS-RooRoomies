type Action =
  | { type: "GET_DNDLISTS_FROM_FIREBASE"; payload: { dndLists: Array<string> } }
  | { type: "REMOVE_FROM_DNDLISTS"; payload: { id: string } }
  | { type: "ADD_TO_DNDLISTS"; payload: { id: string } }
  | { type: "REODER_AND_MOVE_DNDLISTS"; payload: { dndLists: Array<string> } }
  | { type: "RETURN_INITIAL_DNDLISTS" };
const dndListsState: Array<string> = [];

export default function GetDndLists(state = dndListsState, action: Action) {
  switch (action.type) {
    case "GET_DNDLISTS_FROM_FIREBASE": {
      let newState = action.payload.dndLists;
      return newState;
    }
    case "REMOVE_FROM_DNDLISTS": {
      let newState = [...state];
      return newState.filter((i) => {
        return i !== action.payload.id;
      });
    }
    case "ADD_TO_DNDLISTS": {
      let newState = [...state];
      return [...state, action.payload.id];
    }
    case "REODER_AND_MOVE_DNDLISTS": {
      return action.payload.dndLists;
    }
    case "RETURN_INITIAL_DNDLISTS": {
      return dndListsState;
    }
    default:
      return state;
  }
}
