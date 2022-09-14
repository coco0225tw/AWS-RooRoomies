type Action =
  | { type: 'GET_COMPARELISTS_FROM_FIREBASE'; payload: { compareLists: Array<string> } }
  | { type: 'REMOVE_FROM_COMPARELIST'; payload: { id: string } }
  | { type: 'ADD_TO_COMPARELIST'; payload: { id: string } };
const compareListsState: Array<string> = [];

export default function GetCompareLists(state = compareListsState, action: Action) {
  switch (action.type) {
    case 'GET_COMPARELISTS_FROM_FIREBASE': {
      let newState = action.payload.compareLists.reverse();
      return newState;
    }
    case 'REMOVE_FROM_COMPARELIST': {
      let newState = [...state];
      return newState.filter((i) => {
        return i !== action.payload.id;
      });
    }
    case 'ADD_TO_COMPARELIST': {
      let newState = [...state];
      return [...state, action.payload.id];
    }

    default:
      return state;
  }
}
